import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from 'src/entities/bookings/bookings.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { ServiceProvidersModule } from 'src/service-provider/service-provider.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    NotificationsModule,
    UsersModule,
    ServiceProvidersModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
