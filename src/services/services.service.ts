import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/services/services.entity';
import { SearchServiceDto } from '../DTO/search-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find({
      relations: ['provider', 'provider.user'],
    });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { service_id: id },
      relations: ['provider', 'provider.user'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async create(createServiceDto: Partial<Service>): Promise<Service> {
    console.log("HERE")
    const service = this.servicesRepository.create({...createServiceDto});
        console.log("HERE 2",service)

    const savedService = await this.servicesRepository.save(service);
            console.log("HERE 3",savedService)

    return this.findOne(savedService.service_id);
  }

  async update(id: number, updateServiceDto: any): Promise<Service> {
    const service = await this.findOne(id);
    const updatedService = {
      ...service,
      ...updateServiceDto,
      price: updateServiceDto.price ? parseFloat(updateServiceDto.price) : service.price,
    };
    await this.servicesRepository.save(updatedService);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.servicesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }

  async findAllServiceBySpId(providerId: number): Promise<Service[]> {
    return this.servicesRepository.find({
      where: { provider: { provider_id: providerId } },
      relations: ['provider', 'provider.user'],
    });
  }

  async search(filters: SearchServiceDto): Promise<Service[]> {
    const query = this.servicesRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.provider', 'provider')
      .leftJoinAndSelect('provider.user', 'user');

    if (filters.query) {
      query.andWhere(
        '(service.service_name ILIKE :query OR service.description ILIKE :query OR service.location ILIKE :query OR service.service_category ILIKE :query)',
        { query: `%${filters.query}%` }
      );
    }

    if (filters.serviceCategory) {
      query.andWhere('service.service_category = :category', { category: filters.serviceCategory });
    }

    if (filters.minPrice) {
      query.andWhere('service.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice) {
      query.andWhere('service.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.location) {
      query.andWhere('service.location ILIKE :location', { location: `%${filters.location}%` });
    }

    return query.getMany();
  }
}