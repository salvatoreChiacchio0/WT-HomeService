import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProviders.entity';
import { Service } from 'src/entities/services/services.entity';
import { CreateServiceProviderDto } from 'src/DTO/create-service-provider.dto';
import { SearchProviderDto } from 'src/DTO/search-provider.dto';

@Injectable()
export class ServiceProviderService {
  private readonly logger = new Logger(ServiceProviderService.name);

  constructor(
    @InjectRepository(ServiceProviders)
    private readonly serviceProviderRepository: Repository<ServiceProviders>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async findByUserId(userId: number): Promise<ServiceProviders | null> {
    return this.serviceProviderRepository.findOne({
      where: { user_id: userId },
      relations: ['services'], // Include services in the response
    });
  }

  async findOne(id: number): Promise<ServiceProviders> {
    const provider = await this.serviceProviderRepository.findOne({
      where: { provider_id: id },
      relations: ['services'], // Include services in the response
    });
    if (!provider) {
      throw new NotFoundException(`Service provider with ID ${id} not found`);
    }
    return provider;
  }

  async findAll(): Promise<ServiceProviders[]> {
    return this.serviceProviderRepository.find({
      relations: ['services'], // Include services in the response
    });
  }
  
  async findAllByName(name:string): Promise<ServiceProviders[]> {
    return this.serviceProviderRepository.find({ 
      where: { name:name },
      relations: ['services'], // Include services in the response
    });
  }

  async create(data: Partial<ServiceProviders>): Promise<ServiceProviders> {
    const provider = this.serviceProviderRepository.create(data);
    return this.serviceProviderRepository.save(provider);
  }

  async update(id: number, data: Partial<ServiceProviders>): Promise<ServiceProviders> {
    const provider = await this.findOne(id); 
    Object.assign(provider, data);
    return this.serviceProviderRepository.save(provider);
  }

  async delete(id: number): Promise<void> {
    const result = await this.serviceProviderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service provider with ID ${id} not found`);
    }
  }

  async addServices(providerId: number, serviceNames: string[]): Promise<void> {
    const provider = await this.findOne(providerId);
    
    // Create service records for each service name
    for (const serviceName of serviceNames) {
      const service = this.serviceRepository.create({
        service_name: serviceName,
        description: `${serviceName} service provided by ${provider.name}`,
        location: 'Service area to be specified', // Default location
        price: null, // Price will be set later
        images: [],
        service_category: 'General', // Default category
        provider_id: providerId
      });
      await this.serviceRepository.save(service);
    }
  }

  async search(filters: SearchProviderDto): Promise<ServiceProviders[]> {
    this.logger.log('Search filters:', filters);
    const query = this.serviceProviderRepository.createQueryBuilder('provider');

    if (filters.query) {
      query.andWhere('(LOWER(provider.name) LIKE LOWER(:query))', 
        { query: `%${filters.query}%` });
    }

    if (filters.experience !== undefined && filters.experience !== null) {
      const experience = Number(filters.experience);
      if (!isNaN(experience)) {
        query.andWhere('provider.experience = :experience', { experience });
      }
    }

    if (filters.minRating !== undefined && filters.minRating !== null) {
      const rating = Number(filters.minRating);
      if (!isNaN(rating)) {
        query.andWhere('provider.rating >= :minRating', { minRating: rating });
      }
    }

    if (filters.location) {
      query.andWhere('LOWER(provider.availability->>\'location\') LIKE LOWER(:location)', 
        { location: `%${filters.location}%` });
    }

    if (filters.serviceType) {
      query.andWhere('provider.service_type = :serviceType', { serviceType: filters.serviceType });
    }

    return query.getMany();
  }
}
