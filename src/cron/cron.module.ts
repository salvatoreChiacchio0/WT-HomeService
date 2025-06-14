import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BookingStatusCronService } from './booking-status.cron';
import { Booking } from '../entities/bookings/bookings.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Booking]),
  ],
  providers: [BookingStatusCronService],
})
export class CronModule {} 