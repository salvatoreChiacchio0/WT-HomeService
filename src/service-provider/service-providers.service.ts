import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProvider.entity';
import { Service } from 'src/entities/services/services.entity';

@Injectable()
export class ServiceProviderService {
  constructor(
    @InjectRepository(ServiceProviders)
    private readonly serviceProviderRepository: Repository<ServiceProviders>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async findByUserId(userId: number): Promise<ServiceProviders | null> {
    return this.serviceProviderRepository.findOne({
      where: { user_id: userId },
      relations: ['service'], // Include services in the response
    });
  }

  async findOne(id: number): Promise<ServiceProviders> {
    const provider = await this.serviceProviderRepository.findOne({
      where: { provider_id: id },
      relations: ['service'], // Include services in the response
    });
    if (!provider) {
      throw new NotFoundException(`Service provider with ID ${id} not found`);
    }
    return provider;
  }

  async findAll(): Promise<ServiceProviders[]> {
    return this.serviceProviderRepository.find({
      relations: ['service'], // Include services in the response
    });
  }
  
  async findAllByName(name:string): Promise<ServiceProviders[]> {
    return this.serviceProviderRepository.find({ 
      where: { name:name },
      relations: ['service'], // Include services in the response
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
        provider_id: providerId,
        price: null // Price will be set later
      });
      await this.serviceRepository.save(service);
    }
  }
}
