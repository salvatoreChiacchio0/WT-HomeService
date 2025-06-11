import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchServiceDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    query?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    serviceCategory?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(5)
    minRating?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    availability?: boolean;
}