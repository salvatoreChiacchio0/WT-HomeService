import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class SearchServiceProviderDto {
    @ApiProperty({ required: false, nullable: true, description: 'Name of the service provider' })
    @IsOptional()
    @IsString()
    name?: string | null;

    @ApiProperty({ required: false, nullable: true, description: 'Availability status of the service provider' })
    @IsOptional()
    @IsString()
    availability?: string | null;

    @ApiProperty({ required: false, nullable: true, description: 'Minimum years of experience' })
    @IsOptional()
    @IsNumber()
    experience_years?: number | null;
} 