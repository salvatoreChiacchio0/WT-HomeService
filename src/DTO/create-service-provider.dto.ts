import { IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateServiceProviderDto {
@IsNumber()
user_id: number;

@IsOptional()
@IsNumber()
experience_years?: number;

@IsOptional()
@IsNumber()
rating?: number;

@IsOptional()
@IsString()
availability?: string;

@IsOptional()
@IsString()
pricing_model?: string;
}