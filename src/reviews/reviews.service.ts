import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/entities/reviews/reviews.entity';
import { CreateReviewDto } from 'src/DTO/create-review.dto';
import { UpdateReviewDto } from 'src/DTO/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find();
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { review_id: id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      created_at: new Date(createReviewDto.created_at),
    });
    return this.reviewRepository.save(review);
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    Object.assign(review, {
      ...updateReviewDto,
      created_at: updateReviewDto.created_at ? new Date(updateReviewDto.created_at) : review.created_at,
    });
    return this.reviewRepository.save(review);
  }

  async delete(id: number): Promise<void> {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }
}