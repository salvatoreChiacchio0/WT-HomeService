import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from 'src/DTO/create-booking.dto';
import { UpdateBookingDto } from 'src/DTO/update-booking.dto';
import { Booking } from 'src/entities/bookings/bookings.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingsService: BookingService) {}

  @ApiOperation({ summary: 'Get all bookings' })
  @Get()
  async findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @ApiOperation({ summary: 'Get a booking by id' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Create a new booking' })
  @Post()
  async create(@Body() createDto: CreateBookingDto): Promise<Booking> {
    return this.bookingsService.create(createDto);
  }

  @ApiOperation({ summary: 'Update a booking' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookingDto,
  ): Promise<Booking> {
    return this.bookingsService.update(+id, updateDto);
  }

  @ApiOperation({ summary: 'Delete a booking' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.bookingsService.delete(+id);
    return { message: `Booking with ID ${id} deleted successfully` };
  }
}
