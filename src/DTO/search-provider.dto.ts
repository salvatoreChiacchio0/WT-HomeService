import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { ServiceCategory } from '../enums/service-categories.enum';

export class SearchProviderDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    query?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    experience?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    minRating?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    serviceType?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEnum(ServiceCategory)
    serviceCategory?: ServiceCategory;
} 