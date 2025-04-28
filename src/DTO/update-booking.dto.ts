import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @IsNumber()
  provider_id?: number;

  @IsOptional()
  @IsNumber()
  service_id?: number;

  @IsOptional()
  @IsString()
  booking_date?: string;

  @IsOptional()
  @IsString()
  status?: string;
}