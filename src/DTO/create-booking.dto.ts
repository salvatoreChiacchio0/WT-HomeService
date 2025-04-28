import { IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  provider_id: number;

  @IsNumber()
  service_id: number;

  @IsString()
  booking_date: string; 

  @IsString()
  status: string;
}