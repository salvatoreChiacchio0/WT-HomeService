import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  booking_date?: Date;

  @IsOptional()
  @IsString()
  status?: string;
}