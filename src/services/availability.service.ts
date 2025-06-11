import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ProviderAvailability } from '../entities/service-provider/ProviderAvailability.entity';
import { ServiceProviders } from '../entities/service-provider/ServiceProviders.entity';

@Injectable()
export class AvailabilityService {
    constructor(
        @InjectRepository(ProviderAvailability)
        private availabilityRepository: Repository<ProviderAvailability>,
        @InjectRepository(ServiceProviders)
        private providerRepository: Repository<ServiceProviders>,
    ) {}

    async setAvailability(
        providerId: number,
        date: Date,
        startTime: string,
        endTime: string,
        isAvailable: boolean = true,
        notes?: string,
    ): Promise<ProviderAvailability> {
        const provider = await this.providerRepository.findOne({ where: { provider_id: providerId } });
        if (!provider) {
            throw new NotFoundException(`Provider with ID ${providerId} not found`);
        }

        const availability = this.availabilityRepository.create({
            provider_id: providerId,
            date,
            start_time: startTime,
            end_time: endTime,
            is_available: isAvailable,
            notes,
        });

        return this.availabilityRepository.save(availability);
    }

    async getAvailability(
        providerId: number,
        startDate: Date,
        endDate: Date,
    ): Promise<ProviderAvailability[]> {
        return this.availabilityRepository.find({
            where: {
                provider_id: providerId,
                date: Between(startDate, endDate),
            },
            order: {
                date: 'ASC',
                start_time: 'ASC',
            },
        });
    }

    async updateAvailability(
        availabilityId: number,
        updates: Partial<ProviderAvailability>,
    ): Promise<ProviderAvailability> {
        const availability = await this.availabilityRepository.findOne({
            where: { availability_id: availabilityId },
        });

        if (!availability) {
            throw new NotFoundException(`Availability slot with ID ${availabilityId} not found`);
        }

        Object.assign(availability, updates);
        return this.availabilityRepository.save(availability);
    }

    async deleteAvailability(availabilityId: number): Promise<void> {
        const result = await this.availabilityRepository.delete(availabilityId);
        if (result.affected === 0) {
            throw new NotFoundException(`Availability slot with ID ${availabilityId} not found`);
        }
    }

    async checkAvailability(
        providerId: number,
        date: Date,
        startTime: string,
        endTime: string,
    ): Promise<boolean> {
        const availability = await this.availabilityRepository.findOne({
            where: {
                provider_id: providerId,
                date,
                is_available: true,
                start_time: startTime,
                end_time: endTime,
            },
        });

        return !!availability;
    }

    async getAvailableSlots(
        providerId: number,
        date: Date,
    ): Promise<ProviderAvailability[]> {
        return this.availabilityRepository.find({
            where: {
                provider_id: providerId,
                date,
                is_available: true,
            },
            order: {
                start_time: 'ASC',
            },
        });
    }
} 