import { Controller, Get, Param, Logger } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Service } from '../entities/services/services.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('recommendation')
@ApiTags('Recommendations')
@ApiBearerAuth()
export class RecommendationController {
  private readonly logger = new Logger(RecommendationController.name);

  constructor(private readonly recommendationService: RecommendationService) {}

  @Get(':userId')
  async getRecommendations(@Param('userId') userId: string): Promise<Service[]> {
    this.logger.log(`Getting recommendations for user ${userId}`);
    return this.recommendationService.getRecommendations(+userId);
  }
} 