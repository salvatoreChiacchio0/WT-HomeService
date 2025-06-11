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
    return this.serviceRepository.find({
      relations: ['provider']
    });
  }

  async findAllServiceBySpId(id: number) : Promise<Service[]>{
    return this.serviceRepository.find({ 
      where: { provider_id: id },
      relations: ['provider']
    });
  }

async search(filters: SearchServiceDto): Promise<Service[]> {
    this.logger.log('Search filters:', filters);
    const query = this.serviceRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.provider', 'provider')
      .leftJoinAndSelect('provider.reviews', 'reviews')
      .leftJoinAndSelect('reviews.customer', 'customer');

    // Filtro per query di testo
    if (filters.query && filters.query.trim()) {
      query.andWhere('(LOWER(service.service_name) LIKE LOWER(:query) OR LOWER(service.description) LIKE LOWER(:query))', 
        { query: `%${filters.query.trim()}%` });
    }

    // Filtro per categoria
    if (filters.serviceCategory && filters.serviceCategory.trim()) {
      query.andWhere('service.service_category = :serviceCategory', {
        serviceCategory: filters.serviceCategory.trim(),
      });
    }

    // Filtro prezzo minimo
    if (filters.minPrice !== undefined && filters.minPrice !== null && !isNaN(filters.minPrice)) {
      query.andWhere('service.price >= :minPrice', { minPrice: filters.minPrice });
    }

    // Filtro prezzo massimo
    if (filters.maxPrice !== undefined && filters.maxPrice !== null && !isNaN(filters.maxPrice)) {
      query.andWhere('service.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    // Filtro per location
    if (filters.location && filters.location.trim()) {
      query.andWhere('LOWER(service.location) LIKE LOWER(:location)', 
        { location: `%${filters.location.trim()}%` });
    }

    // Filtro rating minimo
    if (filters.minRating !== undefined && filters.minRating !== null && !isNaN(filters.minRating)) {
      query.andWhere('provider.rating >= :minRating', { minRating: filters.minRating });
    }

    // Filtro disponibilità
    if (filters.availability !== undefined && filters.availability !== null) {
      query.andWhere('service.availability->>\'emergency_available\' = :availability', 
        { availability: filters.availability.toString() });
    }

    return query.getMany();
  }
  
  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({ 
      where: { service_id: id },
      relations: ['provider', 'provider.reviews', 'provider.reviews.customer']
    });
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

  // Metodo di test per verificare il caricamento delle reviews
  async testReviewsLoading(providerId: number): Promise<any> {
    const service = await this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.provider', 'provider')
      .leftJoinAndSelect('provider.reviews', 'reviews')
      .leftJoinAndSelect('reviews.customer', 'customer')
      .where('provider.provider_id = :providerId', { providerId })
      .getOne();

    return service;
  }
}