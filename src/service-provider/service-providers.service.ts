import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProviders } from '../entities/service-provider/ServiceProviders.entity';
import { Service } from '../entities/services/services.entity';
import { User } from '../entities/users/users.entity';
import { CreateServiceProviderDto } from 'src/DTO/create-service-provider.dto';
import { SearchProviderDto } from 'src/DTO/search-provider.dto';

@Injectable()
export class ServiceProvidersService {
  constructor(
    @InjectRepository(ServiceProviders)
    private serviceProviderRepository: Repository<ServiceProviders>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<ServiceProviders[]> {
    return this.serviceProviderRepository.find({
      relations: ['user', 'services'],
    });
  }

  async findOne(id: number): Promise<ServiceProviders> {
    const provider = await this.serviceProviderRepository.findOne({
      where: { provider_id: id },
      relations: ['user', 'services'],
    });
    if (!provider) {
      throw new NotFoundException(`Service provider with ID ${id} not found`);
    }
    return provider;
  }

  async findByUserId(userId: number): Promise<ServiceProviders | null> {
    return this.serviceProviderRepository.findOne({
      where: { user: { user_id: userId } },
      relations: ['user', 'services'],
    });
  }

  async create(createServiceProviderDto: any): Promise<ServiceProviders> {
    const user = await this.userRepository.findOne({
      where: { user_id: createServiceProviderDto.user_id }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createServiceProviderDto.user_id} not found`);
    }

    const provider = this.serviceProviderRepository.create({
      user,
      services: [],
    });

    return this.serviceProviderRepository.save(provider);
  }

  async update(id: number, updateServiceProviderDto: any): Promise<ServiceProviders> {
    const provider = await this.findOne(id);
    Object.assign(provider, updateServiceProviderDto);
    return this.serviceProviderRepository.save(provider);
  }

  async remove(id: number): Promise<void> {
    const result = await this.serviceProviderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service provider with ID ${id} not found`);
    }
  }

  async addService(providerId: number, serviceData: any): Promise<Service> {
    const provider = await this.findOne(providerId);
    
    const service = new Service();
    service.service_name = serviceData.service_name;
    service.description = serviceData.description;
    service.price = serviceData.price;
    service.service_category = serviceData.service_category;
    service.location = serviceData.location;
    service.pricing_model = serviceData.pricing_model;
    service.availability = serviceData.availability;
    service.images = serviceData.image || '';
    service.provider = provider;

    return this.serviceRepository.save(service);
  }

  async removeService(providerId: number, serviceId: number): Promise<void> {
    const provider = await this.findOne(providerId);
    const service = await this.serviceRepository.findOne({
      where: { service_id: serviceId, provider: { provider_id: providerId } },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found for provider ${providerId}`);
    }

    await this.serviceRepository.remove(service);
  }

  async findAllServices(providerId: number): Promise<Service[]> {
    const provider = await this.findOne(providerId);
    return this.serviceRepository.find({
      where: { provider: { provider_id: providerId } },
      relations: ['provider', 'provider.user'],
    });
  }

async search(filters: SearchProviderDto): Promise<ServiceProviders[]> {
  filters.priceType = filters.priceType?.toString()
  console.log(filters.priceType)
  const query = this.serviceProviderRepository.createQueryBuilder('provider')
    .leftJoinAndSelect('provider.services', 'services')
    .leftJoinAndSelect('provider.reviews', 'reviews')
    .leftJoinAndSelect('provider.user', 'user');

  if (filters.query) {
    query.andWhere('(LOWER(provider.name) LIKE LOWER(:query) OR LOWER(services.service_name) LIKE LOWER(:query))', 
      { query: `%${filters.query}%` });
  }

  if (filters.experience) {
    query.andWhere('provider.experience_years >= :experience', { experience: filters.experience });
  }

  if (filters.minRating) {
    query.andWhere(qb => {
      const subQuery = qb
        .subQuery()
        .select('AVG(review.rating)')
        .from('reviews', 'review')
        .where('review.provider_id = provider.provider_id')
        .getQuery();
      return `${subQuery} >= :minRating`;
    })
    .setParameter('minRating', filters.minRating);
  }

  if (filters.location) {
    query.andWhere('LOWER(services.location) LIKE LOWER(:location)', 
      { location: `%${filters.location}%` });
  }

  if (filters.serviceType) {
    query.andWhere('LOWER(services.service_name) LIKE LOWER(:serviceType)', 
      { serviceType: `%${filters.serviceType}%` });
  }

  if (filters.serviceCategory) {
    query.andWhere('services.service_category = :serviceCategory', 
      { serviceCategory: `%${filters.serviceCategory}` });
  }

  if (filters.priceType) {
    query.andWhere('LOWER(services.pricing_model) = LOWER(:pricing_model)', 
      { pricing_model: filters.priceType });
  }


  const providers = await query.getMany();

  return providers.map(provider => {
    const averageRating = provider.reviews && provider.reviews.length > 0
      ? provider.reviews.reduce((acc, review) => acc + review.rating, 0) / provider.reviews.length
      : 0;
    
    return {
      ...provider,
      rating: averageRating,
      review_count: provider.reviews?.length || 0
    };
  });
}
}
