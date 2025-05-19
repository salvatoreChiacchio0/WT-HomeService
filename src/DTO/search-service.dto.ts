import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber, IsBoolean, isNumber } from 'class-validator';

export class SearchServiceDto {

    @ApiProperty()
    @IsOptional()
    @IsString()
     name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
     serviceCategory?: string;

  
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price?: Number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rating?: Number;
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  availability?: boolean;
}