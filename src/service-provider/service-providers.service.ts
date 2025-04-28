import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProvider.entity';

@Injectable()
export class ServiceProviderService {
  constructor(
    @InjectRepository(ServiceProviders)
    private readonly serviceProviderRepository: Repository<ServiceProviders>,
  ) {}

  async findOne(id: number): Promise<ServiceProviders> {
    const provider = await this.serviceProviderRepository.findOne({
      where: { provider_id: id },
    });
    if (!provider) {
      throw new NotFoundException(`Service provider with ID ${id} not found`);
    }
    return provider;
  }

  async findAll(): Promise<ServiceProviders[]> {
    return this.serviceProviderRepository.find();
  }

  async create(data: Partial<ServiceProviders>): Promise<ServiceProviders> {
    const provider = this.serviceProviderRepository.create(data);
    return this.serviceProviderRepository.save(provider);
  }

  async update(id: number, data: Partial<ServiceProviders>): Promise<ServiceProviders> {
    const provider = await this.findOne(id); // Riusa findOne per gestire il caso 'not found'
    Object.assign(provider, data);
    return this.serviceProviderRepository.save(provider);
  }

  async delete(id: number): Promise<void> {
    const result = await this.serviceProviderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service provider with ID ${id} not found`);
    }
  }

}
