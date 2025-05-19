import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class SearchServiceDto {
    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsString()
    name?: string | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsString()
    serviceCategory?: string | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsNumber()
    price?: number | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsNumber()
    rating?: number | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsBoolean()
    availability?: boolean | null;
}