import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  service_name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number
  
}