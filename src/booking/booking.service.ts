import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/entities/bookings/bookings.entity';
import { CreateBookingDto } from 'src/DTO/create-booking.dto';
import { UpdateBookingDto } from 'src/DTO/update-booking.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';
import { ServiceProvidersService } from 'src/service-provider/service-providers.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { booking_id: id } });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async findByUserId(id: number): Promise<Booking[]> {
    const bookings = await this.bookingRepository.find({ where: { user_id: id } });
    if (!bookings) {
      throw new NotFoundException(`Booking for user ID ${id} not found`);
    }
    return bookings;
  }
  

  private async hasConflictingBookings(
    providerId: number,
    userId: number,
    bookingDate: Date,
    bookingTime: string,
  ): Promise<boolean> {
    const conflictingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where(
        '(booking.provider_id = :providerId OR booking.user_id = :userId) AND booking.booking_date = :bookingDate AND booking.booking_time = :bookingTime AND booking.status IN (:...statuses)',
        {
          providerId,
          userId,
          bookingDate,
          bookingTime,
          statuses: ['pending', 'accepted'],
        },
      )
      .getMany();

    return conflictingBookings.length > 0;
  }

  async create(createBookingDto: Partial<Booking>): Promise<Booking> {
    if (!createBookingDto.booking_date) {
      throw new BadRequestException('Booking date is required');
    }

    if (!createBookingDto.booking_time) {
      throw new BadRequestException('Booking time is required');
    }

    if (!createBookingDto.provider_id) {
      throw new BadRequestException('Provider ID is required');
    }

    if (!createBookingDto.user_id) {
      throw new BadRequestException('User ID is required');
    }

    const hasConflicts = await this.hasConflictingBookings(
      createBookingDto.provider_id,
      createBookingDto.user_id,
      createBookingDto.booking_date,
      createBookingDto.booking_time,
    );

    if (hasConflicts) {
      throw new BadRequestException(
        'There is already a booking at this time for either the provider or the user',
      );
    }

    const booking = this.bookingRepository.create({...createBookingDto});
    const savedBooking = await this.bookingRepository.save(booking);

    // Get user and provider details for notification
    const user = await this.usersService.findOneById(createBookingDto.user_id);
    const provider = await this.serviceProvidersService.findOne(createBookingDto.provider_id);

    if (!user || !provider) {
      throw new Error('User or provider not found');
    }

    // Create notification for provider
    await this.notificationsService.create({
      type: 'BOOKING_REQUEST',
      text: `New booking request from ${user.username} for ${new Date(createBookingDto.booking_date).toLocaleDateString()} at ${createBookingDto.booking_time}`,
        sender: user, // The customer will be notified
        userId: provider.user_id.toString()
         });

    return savedBooking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    
    if (updateBookingDto.booking_date) {
      updateBookingDto.booking_date = updateBookingDto.booking_date instanceof Date 
        ? updateBookingDto.booking_date 
        : new Date(updateBookingDto.booking_date);
    }

    Object.assign(booking, updateBookingDto);
    const updatedBooking = await this.bookingRepository.save(booking);

    // If status is being updated, send notification
    if (updateBookingDto.status) {
      const user = await this.usersService.findOneById(booking.user_id);
      const provider = await this.serviceProvidersService.findOne(booking.provider_id);

      if (!user || !provider) {
        throw new Error('User or provider not found');
      }
      // Create notification for customer
      await this.notificationsService.create({
        type: 'BOOKING_STATUS',
        text: `Your booking has been ${updateBookingDto.status.toLowerCase()}`,
        sender: user, // The customer will be notified
        userId: booking.user_id.toString()
      });
    }

    return updatedBooking;
  }

  async delete(id: number): Promise<void> {
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }
    async findByServiceProvider(provider_id: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { provider_id },
      relations: ['service', 'reviews', 'provider'],
      order: {
        booking_date: 'DESC'
      }
    });
  }
}