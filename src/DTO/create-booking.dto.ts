import { IsNumber, IsString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookingDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  provider_id: number;

  @IsNumber()
  service_id: number;

  @IsDateString()
  @Transform(({ value }) => new Date(value))
  booking_date: Date;

  @IsString()
  status: string;
}