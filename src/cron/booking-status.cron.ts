import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Booking } from '../entities/bookings/bookings.entity';

@Injectable()
export class BookingStatusCronService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR, {
    name: 'update-completed-bookings'
  })
  async updateCompletedBookings() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Find all accepted bookings from the previous hour
    const bookingsToUpdate = await this.bookingRepository.find({
      where: {
        status: 'accepted',
        booking_date: LessThanOrEqual(now),
        booking_time: LessThanOrEqual(now.toTimeString().slice(0, 5)), // Format: HH:mm
      },
    });

    // Update status to completed
    for (const booking of bookingsToUpdate) {
      booking.status = 'completed';
      await this.bookingRepository.save(booking);
    }

    console.log(`Updated ${bookingsToUpdate.length} bookings to completed status`);
  }
} 