import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  user_id: number;

   @IsNumber()
  customer_id: number;

  @IsNumber()
  provider_id: number;

  @IsNumber()
  booking_id: number;

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  review_text?: string;

  @IsString()
  created_at: string; // ISO stringa per le date tipo "2025-04-28T10:00:00Z"
}