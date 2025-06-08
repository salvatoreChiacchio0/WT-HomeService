import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from 'src/DTO/create-review.dto';
import { UpdateReviewDto } from 'src/DTO/update-review.dto';
import { Review } from 'src/entities/reviews/reviews.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('reviews')
@ApiBearerAuth()

export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async findAll(): Promise<Review[]> {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findOne(+id);
  }

  @Post()
  async create(@Body() createDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateReviewDto): Promise<Review> {
    return this.reviewsService.update(+id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.reviewsService.delete(+id);
    return { message: `Review with ID ${id} deleted successfully` };
  }

  @Get('user/:id')
  async findByUserId(@Param('id') id: string): Promise<Review[]> {  
    return this.reviewsService.findByUserId(+id);
  }
}
