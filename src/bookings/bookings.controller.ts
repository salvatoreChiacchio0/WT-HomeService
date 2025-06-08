import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from '../entities/bookings/bookings.entity';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Get()
    findAll(): Promise<Booking[]> {
        return this.bookingsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Booking> {
        return this.bookingsService.findOne(id);
    }

    @Post()
    create(@Body() booking: Booking): Promise<Booking> {
        return this.bookingsService.create(booking);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() booking: Booking): Promise<Booking> {
        return this.bookingsService.update(id, booking);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.bookingsService.remove(id);
    }
} 