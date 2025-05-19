import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingDto {
  @ApiProperty({ description: 'ID of the user making the booking', required: false })
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @ApiProperty({ description: 'ID of the service provider', required: false })
  @IsOptional()
  @IsNumber()
  provider_id?: number;

  @ApiProperty({ description: 'ID of the service being booked', required: false })
  @IsOptional()
  @IsNumber()
  service_id?: number;

  @ApiProperty({ description: 'Date of the booking', example: '2024-03-20T10:00:00Z', required: false })
  @IsOptional()
  @IsString()
  booking_date?: string;

  @ApiProperty({ description: 'Status of the booking', example: 'pending', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}