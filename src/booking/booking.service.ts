import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/entities/bookings/bookings.entity';
import { CreateBookingDto } from 'src/DTO/create-booking.dto';
import { UpdateBookingDto } from 'src/DTO/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
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
    return this.bookingRepository.save(booking);
  }

  async update(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    
    if (updateBookingDto.booking_date) {
      updateBookingDto.booking_date = updateBookingDto.booking_date instanceof Date 
        ? updateBookingDto.booking_date 
        : new Date(updateBookingDto.booking_date);
    }

    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
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