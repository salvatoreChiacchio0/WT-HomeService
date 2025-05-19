import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProvider.entity';
import { SearchServiceProviderDto } from 'src/DTO/search-service-provider.dto';

@Injectable()
export class ServiceProviderService {
  private readonly logger = new Logger(ServiceProviderService.name);

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

  async search(filters: SearchServiceProviderDto): Promise<ServiceProviders[]> {
    this.logger.debug('Starting search with filters:', JSON.stringify(filters, null, 2));
    
    const query = this.serviceProviderRepository.createQueryBuilder('provider');

    if (filters.name) {
      this.logger.debug(`Adding name filter: ${filters.name}`);
      query.andWhere('LOWER(provider.name) LIKE LOWER(:name)', { 
        name: `%${filters.name}%` 
      });
    }

    if (filters.availability) {
      this.logger.debug(`Adding availability filter: ${filters.availability}`);
      query.andWhere('provider.availability = :availability', {
        availability: filters.availability,
      });
    }

    if (filters.experience_years !== undefined && filters.experience_years !== null) {
      this.logger.debug(`Adding experience years filter: ${filters.experience_years}`);
      query.andWhere('provider.experience_years >= :experience_years', { 
        experience_years: filters.experience_years 
      });
    }

    const sql = query.getSql();
    this.logger.debug('Generated SQL query:', sql);
    
    const results = await query.getMany();
    this.logger.debug(`Search returned ${results.length} results`);
    
    return results;
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
}
