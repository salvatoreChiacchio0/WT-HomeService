import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class PricingModelDto {
  @IsNumber()
  base_price: number;

  @IsNumber()
  hourly_rate: number;

  @IsArray()
  @IsString({ each: true })
  additional_fees: string[];
}

class AvailabilityDto {
  @IsArray()
  @IsString({ each: true })
  days: string[];

  @IsArray()
  @IsString({ each: true })
  time_slots: string[];

  @IsBoolean()
  emergency_available: boolean;
}

class RequirementsDto {
  @IsArray()
  @IsString({ each: true })
  equipment: string[];

  @IsArray()
  @IsString({ each: true })
  qualifications: string[];

  @IsString()
  special_instructions: string;
}

export class CreateServiceDto {
  @IsString()
  service_name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  service_category: string;

  @IsString()
  location: string;

  @ValidateNested()
  @Type(() => PricingModelDto)
  pricing_model: PricingModelDto;

  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto;

  @ValidateNested()
  @Type(() => RequirementsDto)
  requirements: RequirementsDto;

  @IsOptional()
  @IsString()
  image?: string;
} 