import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { ServiceModule } from '../services/service.module';
import { BookingModule } from '../booking/booking.module';
import { ServiceProvidersModule } from 'src/service-provider/service-provider.module';
import { ReviewsModule } from 'src/reviews/review.module';
import { BookingService } from 'src/booking/booking.service';
import { ServicesService } from 'src/services/services.service';
import { ServiceProviderService } from 'src/service-provider/service-providers.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ServiceModule,
    BookingModule,
    ServiceProvidersModule,
    ReviewsModule,
    CacheModule.register({ ttl: 600, max: 100 }),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService], 
  exports: [RecommendationService],
})
export class RecommendationModule {}