import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateServiceProviderDto {

@ApiProperty()
@IsNumber()
user_id: number;

@ApiProperty()
@IsOptional()
@IsNumber()
experience_years?: number;

@ApiProperty()
@IsOptional()
@IsNumber()
rating?: number;

@ApiProperty()
@IsOptional()
@IsString()
availability?: string;

@ApiProperty()
@IsString()
name: string;

@ApiProperty()
@IsOptional()
@IsString()
pricing_model?: string;
}