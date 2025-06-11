import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

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
} 