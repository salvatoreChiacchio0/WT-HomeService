import { IsNumber, IsString, IsDateString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookingDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  provider_id: number;

  @IsNumber()
  service_id: number;

  @IsNumber()
  price: number;

  @IsString()
  booking_date: Date;
   @IsString()
  booking_time: string;

  @IsString()
  status: string;
}