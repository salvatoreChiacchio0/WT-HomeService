import { Controller, Get, Post, Put, Delete, Param, Body, Query, Logger, ValidationPipe } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from 'src/entities/services/services.entity';
import { CreateServiceDto } from 'src/DTO/create-service.dto';
import { UpdateServiceDto } from 'src/DTO/update-service.dto';
import { ApiBearerAuth, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { SearchServiceDto } from 'src/DTO/search-service.dto';

@Controller('services')
@ApiBearerAuth()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  private readonly logger = new Logger(ServicesController.name);

  @Get()
  async findAll(): Promise<Service[]> {
    return this.servicesService.findAll();
  }

  // Spostato il search PRIMA del findOne per evitare conflitti di rotte
  @Get('search')
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'serviceCategory', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'minRating', required: false })
  @ApiQuery({ name: 'availability', required: false })
  async searchServices(
    @Query('query') query?: string,
    @Query('serviceCategory') serviceCategory?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('location') location?: string,
    @Query('minRating') minRating?: string,
    @Query('availability') availability?: string,
  ) {
    // Conversione sicura dei parametri numerici
    const filters: SearchServiceDto = {
      query: query || undefined,
      serviceCategory: serviceCategory || undefined,
      minPrice: minPrice ? this.parseNumber(minPrice) : undefined,
      maxPrice: maxPrice ? this.parseNumber(maxPrice) : undefined,
      location: location || undefined,
      minRating: minRating ? this.parseNumber(minRating) : undefined,
      availability: availability ? this.parseBoolean(availability) : undefined,
    };
    
    this.logger.log('Search parameters:', filters);
    return this.servicesService.search(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Service> {
    return this.servicesService.findOne(+id);
  }
  
  @Post()
  async create(@Body() createDto: Service): Promise<Service> {
    return this.servicesService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateServiceDto): Promise<Service> {
    return this.servicesService.update(+id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.servicesService.delete(+id);
    return { message: `Service with ID ${id} deleted successfully` };
  }

  // Dammi tutti i service dato un service provider id
  @Get('ServiceProvider/:id')
  async findAllServiceBySpId(@Param('id') id: string) {
    return this.servicesService.findAllServiceBySpId(+id);
  }

  @Get('test-reviews/:providerId')
  @ApiOperation({ summary: 'Test reviews loading for a provider' })
  async testReviewsLoading(@Param('providerId') providerId: string) {
    return this.servicesService.testReviewsLoading(+providerId);
  }

  // Metodi di utilità per la conversione sicura dei tipi
  private parseNumber(value: string): number | undefined {
    if (!value || value.trim() === '') return undefined;
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  }

  private parseBoolean(value: string): boolean | undefined {
    if (!value || value.trim() === '') return undefined;
    return value.toLowerCase() === 'true';
  }
}