import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  provider_id: number;

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsString()
  created_at: string; // ISO stringa per le date tipo "2025-04-28T10:00:00Z"
}