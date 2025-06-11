import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Query, ValidationPipe, Logger } from '@nestjs/common';
import { ServiceProviderService } from './service-providers.service';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProviders.entity';
import { CreateServiceProviderDto } from 'src/DTO/create-service-provider.dto';
import { ApiBearerAuth, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { SearchProviderDto } from 'src/DTO/search-provider.dto';

@Controller('service-providers')
@ApiBearerAuth()
export class ServiceProvidersController {
  private readonly logger = new Logger(ServiceProvidersController.name);

  constructor(private readonly serviceProviderService: ServiceProviderService) {}

  @Get()
  async findAll(): Promise<ServiceProviders[]> {
    return this.serviceProviderService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search service providers' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query for name or description' })
  @ApiQuery({ name: 'experience', required: false, description: 'Years of experience' })
  @ApiQuery({ name: 'minRating', required: false, description: 'Minimum rating (1-5)' })
  @ApiQuery({ name: 'location', required: false, description: 'Location/area of service' })
  @ApiQuery({ name: 'serviceType', required: false, description: 'Type of service offered' })
  async searchProviders(
    @Query('query') query?: string,
    @Query('experience') experience?: string,
    @Query('minRating') minRating?: string,
    @Query('location') location?: string,
    @Query('serviceType') serviceType?: string,
  ): Promise<ServiceProviders[]> {
    const filters: SearchProviderDto = {
      query: query || undefined,
      experience: experience ? this.parseNumber(experience) : undefined,
      minRating: minRating ? this.parseNumber(minRating) : undefined,
      location: location || undefined,
      serviceType: serviceType || undefined,
    };
    
    this.logger.log('Search parameters:', filters);
    return this.serviceProviderService.search(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceProviders> {
    const serviceProvider = await this.serviceProviderService.findOne(+id);
    if (!serviceProvider) {
      throw new NotFoundException(`Service provider with ID ${id} not found`);
    }
    return serviceProvider;
  }

  @Get('/findByName/:name')
  async findByName(@Param('name') name: string): Promise<ServiceProviders[]> {
    const serviceProviders = await this.serviceProviderService.findAllByName(name);
    return serviceProviders;
  }

  @Post()
  async create(@Body() createDto: CreateServiceProviderDto): Promise<ServiceProviders> {
    return this.serviceProviderService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<ServiceProviders>,
  ): Promise<ServiceProviders> {
    return this.serviceProviderService.update(+id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.serviceProviderService.delete(+id);
    return { message: `Service provider with ID ${id} deleted successfully` };
  }

  // Metodi di utilità per la conversione sicura dei tipi
  private parseNumber(value: string): number | undefined {
    if (!value || value.trim() === '') return undefined;
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  }
}