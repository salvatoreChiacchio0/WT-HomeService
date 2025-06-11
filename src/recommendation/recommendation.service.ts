import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { ServicesService } from '../services/services.service';
import { Service } from '../entities/services/services.entity';
import { BookingService } from '../booking/booking.service';
import { ServiceProviderService } from '../service-provider/service-providers.service';
import { ReviewsService } from '../reviews/reviews.service';

interface Booking {
  service_id: number;
  provider_id: number;
}

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(
    private readonly servicesService: ServicesService,
    private readonly bookingsService: BookingService,
    private readonly serviceProvidersService: ServiceProviderService,
    private readonly reviewService: ReviewsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getRecommendations(userId: number): Promise<Service[]> {
    try {
      const userBookings: Booking[] =
        await this.bookingsService.findByUserId(userId);
      const allServices = await this.servicesService.findAll();

      const averagePrice = this.calculateAverageServicePrice(allServices);
      const userProviderPreferences =
        this.getUserProviderPreferences(userBookings);
      const providerRatingsMap = await this.preloadProviderRatings(allServices);

      const scoredServices = allServices.map((service) => ({
        service,
        score: this.calculateServiceScore(
          service,
          userBookings,
          averagePrice,
          userProviderPreferences,
          providerRatingsMap,
        ),
      }));

      const recommendedServices = scoredServices
        .sort((a, b) => b.score - a.score)
        .map((item) => item.service);

      if (recommendedServices.length < 10) {
        const remainingCount = 10 - recommendedServices.length;
        const recommendedIds = new Set(
          recommendedServices.map((s) => s.service_id),
        );
        const additionalServices = this.getAdditionalServices(
          recommendedIds,
          allServices,
          remainingCount,
        );
        return [...recommendedServices, ...additionalServices];
      }

      return recommendedServices.slice(0, 10);
    } catch (error) {
      this.logger.error(
        `Error getting recommendations for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private calculateServiceScore(
    service: Service,
    userBookings: Booking[],
    averagePrice: number,
    userProviderPreferences: Record<number, number>,
    providerRatingsMap: Map<number, number>,
  ): number {
    let score = 0;

    // Rating del provider (dalla cache)
    const rating = providerRatingsMap.get(service.provider.provider_id);
    if (typeof rating === 'number') {
      score += rating * 1;
    }

    // Frequenza prenotazioni
    const bookingCount = userBookings.filter(
      (b) => b.service_id === service.service_id,
    ).length;
    score += Math.min(bookingCount, 3);

    // Preferenze utente per provider
    if (userProviderPreferences[service.provider.provider_id]) {
      score += 2;
    }

    // Prezzo competitivo
    if (service.price && service.price <= averagePrice) {
      score += 2;
    }

    return score;
  }

  private getUserProviderPreferences(
    bookings: Booking[],
  ): Record<number, number> {
    const preferences: Record<number, number> = {};
    bookings.forEach((booking) => {
      if (booking.provider_id) {
        preferences[booking.provider_id] =
          (preferences[booking.provider_id] || 0) + 1;
      }
    });
    return preferences;
  }

  private calculateAverageServicePrice(services: Service[]): number {
    if (services.length === 0) return 0;
    const total = services.reduce(
      (sum, service) => sum + (service.price || 0),
      0,
    );
    return total / services.length;
  }

  private async preloadProviderRatings(
    services: Service[],
  ): Promise<Map<number, number>> {
    const uniqueProviderIds = [
      ...new Set(services.map((s) => s.provider.provider_id)),
    ].filter(Boolean);

    // Carica tutti i rating in batch (con cache)
    const ratings = await Promise.all(
      uniqueProviderIds.map((id) => this.getCachedProviderRating(id)),
    );

    const ratingsMap = new Map<number, number>();
    uniqueProviderIds.forEach((id, index) => {
      ratingsMap.set(id, ratings[index]);
    });

    return ratingsMap;
  }

  private async getCachedProviderRating(providerId: number): Promise<number> {
    const cacheKey = `provider_rating:${providerId}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (typeof cached === 'number') {
      return cached;
    }

    const reviews = await this.reviewService.findByUserId(providerId);
    if (!reviews.length) return 0;

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;

    await this.cacheManager.set(cacheKey, avgRating);
    return avgRating;
  }

  private getAdditionalServices(
    usedIds: Set<number>,
    allServices: Service[],
    count: number,
  ): Service[] {
    return allServices
      .filter((service) => !usedIds.has(service.service_id))
      .sort((a, b) => b.service_id - a.service_id) // Usa ID come proxy della novità
      .slice(0, count);
  }
}
