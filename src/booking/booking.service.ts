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
  

  async create(createBookingDto: Partial<Booking>): Promise<Booking> {
    console.log(createBookingDto)
    if (!createBookingDto.booking_date) {
      throw new BadRequestException('Booking date is required');
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