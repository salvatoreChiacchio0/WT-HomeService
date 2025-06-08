import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/bookings/bookings.entity';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
    ) {}

    findAll(): Promise<Booking[]> {
        return this.bookingsRepository.find();
    }

    async findOne(id: number): Promise<Booking> {
        const booking = await this.bookingsRepository.findOne({ where: { booking_id: id } });
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }

    create(booking: Booking): Promise<Booking> {
        return this.bookingsRepository.save(booking);
    }

    async update(id: number, booking: Booking): Promise<Booking> {
        await this.findOne(id);
        await this.bookingsRepository.update(id, booking);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const result = await this.bookingsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
    }
} 