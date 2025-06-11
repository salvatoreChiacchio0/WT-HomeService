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

  async create(data: CreateServiceProviderDto | Partial<ServiceProviders>): Promise<ServiceProviders> {
    const providerData = { ...data };
    let serviceCategories: string[] = [];

    if ('serviceCategories' in data) {
      serviceCategories = data.serviceCategories || [];
    } else if ('service_categories' in data) {
      serviceCategories = data.service_categories || [];
    }

    const provider = this.serviceProviderRepository.create({
      ...providerData,
      service_categories: serviceCategories
    });
    const savedProvider = await this.serviceProviderRepository.save(provider);
    
    if (serviceCategories.length > 0) {
      await this.addServices(savedProvider.provider_id, serviceCategories);
    }
    
    return this.findOne(savedProvider.provider_id);
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
      query.andWhere('provider.rating >= :minRating', { minRating: filters.minRating });
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
        { serviceCategory: filters.serviceCategory });
    }

    return query.getMany();
  }
}
