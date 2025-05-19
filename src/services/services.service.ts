import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from 'src/entities/services/services.entity';
import { CreateServiceDto } from 'src/DTO/create-service.dto';
import { UpdateServiceDto } from 'src/DTO/update-service.dto';
import { SearchServiceDto } from 'src/DTO/search-service.dto';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);
  

  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find();
  }

  async findAllServiceBySpId(id: number) : Promise<Service[]>{
    return this.serviceRepository.find({ where: {provider_id: id}});
  }

  async search(filters: SearchServiceDto): Promise<Service[]> {
    this.logger.log(filters);
    const query = this.serviceRepository.createQueryBuilder('service');

    if (filters.name) {
      query.andWhere('LOWER(service.name) LIKE LOWER(:name)', { name: `%${filters.name}%` });
    }

    if (filters.serviceCategory) {
      query.andWhere('service.serviceCategory = :serviceCategory', {
        serviceCategory: filters.serviceCategory,
      });
    }
    /*
    if (filters.price !== undefined) {
      query.andWhere('service.price <= :price', { price: filters.price });
    }

    if (filters.rating !== undefined) {
      query.andWhere('service.range >= :range', { range: filters.rating });
    }

    if (filters.availability !== undefined) {
      query.andWhere('service.availability = :availability', { availability: filters.availability });
    }*/

    return query.getMany();
  }
  
  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { service_id: id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async create(createServiceDto: Service): Promise<Service> {
    const service = this.serviceRepository.create(createServiceDto);
    return this.serviceRepository.save(service);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    Object.assign(service, updateServiceDto);
    return this.serviceRepository.save(service);
  }

  async delete(id: number): Promise<void> {
    const result = await this.serviceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }
}