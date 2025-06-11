import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { Service } from '../entities/services/services.entity';
import { ServiceProviders } from '../entities/service-provider/ServiceProviders.entity';

@Injectable()
export class AdvancedSearchService {
    constructor(
        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,
        @InjectRepository(ServiceProviders)
        private providerRepository: Repository<ServiceProviders>,
    ) {}

    async searchServices(params: {
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        serviceType?: string;
        minRating?: number;
        availability?: string;
        keywords?: string[];
    }) {
        const query = this.serviceRepository.createQueryBuilder('service')
            .leftJoinAndSelect('service.provider_id', 'provider')
            .leftJoinAndSelect('provider.review', 'reviews');

        if (params.location) {
            query.andWhere('service.location LIKE :location', { location: `%${params.location}%` });
        }

        if (params.minPrice !== undefined && params.maxPrice !== undefined) {
            query.andWhere('service.price BETWEEN :minPrice AND :maxPrice', {
                minPrice: params.minPrice,
                maxPrice: params.maxPrice,
            });
        }

        if (params.serviceType) {
            query.andWhere('service.service_name = :serviceType', { serviceType: params.serviceType });
        }

        if (params.minRating) {
            query.andWhere('provider.rating >= :minRating', { minRating: params.minRating });
        }

        if (params.availability) {
            query.andWhere('provider.availability LIKE :availability', { availability: `%${params.availability}%` });
        }

        if (params.keywords && params.keywords.length > 0) {
            const keywordConditions = params.keywords.map(keyword => 
                `(service.service_name LIKE :keyword${keyword} OR service.description LIKE :keyword${keyword})`
            ).join(' OR ');
            
            const keywordParams = {};
            params.keywords.forEach(keyword => {
                keywordParams[`keyword${keyword}`] = `%${keyword}%`;
            });

            query.andWhere(`(${keywordConditions})`, keywordParams);
        }

        return query.getMany();
    }

    async searchProviders(params: {
        location?: string;
        serviceType?: string;
        minRating?: number;
        availability?: string;
        experienceYears?: number;
    }) {
        const query = this.providerRepository.createQueryBuilder('provider')
            .leftJoinAndSelect('provider.service', 'services')
            .leftJoinAndSelect('provider.review', 'reviews');

        if (params.location) {
            query.andWhere('services.location LIKE :location', { location: `%${params.location}%` });
        }

        if (params.serviceType) {
            query.andWhere('services.service_name = :serviceType', { serviceType: params.serviceType });
        }

        if (params.minRating) {
            query.andWhere('provider.rating >= :minRating', { minRating: params.minRating });
        }

        if (params.availability) {
            query.andWhere('provider.availability LIKE :availability', { availability: `%${params.availability}%` });
        }

        if (params.experienceYears) {
            query.andWhere('provider.experience_years >= :experienceYears', { experienceYears: params.experienceYears });
        }

        return query.getMany();
    }
} 