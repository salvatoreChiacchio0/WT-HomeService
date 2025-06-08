import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AvailabilityService } from '../services/availability.service';
import { ProviderAvailability } from '../entities/service-provider/ProviderAvailability.entity';

@Controller('provider-availability')
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) {}

    @Post(':providerId')
    async setAvailability(
        @Param('providerId') providerId: number,
        @Body() data: {
            date: Date;
            startTime: string;
            endTime: string;
            isAvailable?: boolean;
            notes?: string;
        },
    ): Promise<ProviderAvailability> {
        return this.availabilityService.setAvailability(
            providerId,
            data.date,
            data.startTime,
            data.endTime,
            data.isAvailable,
            data.notes,
        );
    }

    @Get(':providerId')
    async getAvailability(
        @Param('providerId') providerId: number,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ): Promise<ProviderAvailability[]> {
        return this.availabilityService.getAvailability(
            providerId,
            new Date(startDate),
            new Date(endDate),
        );
    }

    @Get(':providerId/slots')
    async getAvailableSlots(
        @Param('providerId') providerId: number,
        @Query('date') date: string,
    ): Promise<ProviderAvailability[]> {
        return this.availabilityService.getAvailableSlots(
            providerId,
            new Date(date),
        );
    }

    @Put(':availabilityId')
    async updateAvailability(
        @Param('availabilityId') availabilityId: number,
        @Body() updates: Partial<ProviderAvailability>,
    ): Promise<ProviderAvailability> {
        return this.availabilityService.updateAvailability(availabilityId, updates);
    }

    @Delete(':availabilityId')
    async deleteAvailability(
        @Param('availabilityId') availabilityId: number,
    ): Promise<void> {
        return this.availabilityService.deleteAvailability(availabilityId);
    }

    @Get(':providerId/check')
    async checkAvailability(
        @Param('providerId') providerId: number,
        @Query('date') date: string,
        @Query('startTime') startTime: string,
        @Query('endTime') endTime: string,
    ): Promise<{ available: boolean }> {
        const isAvailable = await this.availabilityService.checkAvailability(
            providerId,
            new Date(date),
            startTime,
            endTime,
        );
        return { available: isAvailable };
    }
} 