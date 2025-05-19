import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID of the user making the booking' })
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'ID of the service provider' })
  @IsNumber()
  provider_id: number;

  @ApiProperty({ description: 'ID of the service being booked' })
  @IsNumber()
  service_id: number;

  @ApiProperty({ description: 'Date of the booking', example: '2024-03-20T10:00:00Z' })
  @IsString()
  booking_date: string; 

  @ApiProperty({ description: 'Status of the booking', example: 'pending' })
  @IsString()
  status: string;
}