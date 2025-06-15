import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ServiceProvidersService } from './service-providers.service';
import { CreateServiceProviderDto } from '../DTO/create-service-provider.dto';
import { UpdateServiceProviderDto } from '../DTO/update-service-provider.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ServiceProviders } from '../entities/service-provider/ServiceProviders.entity';
import { ApiBearerAuth, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { SearchProviderDto } from 'src/DTO/search-provider.dto';
import { ServiceCategory } from 'src/enums/service-categories.enum';

@Controller('service-providers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ServiceProvidersController {
  constructor(private readonly serviceProviderService: ServiceProvidersService) {}

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
  @ApiQuery({ name: 'serviceCategory', required: false, description: 'Category of service', enum: ServiceCategory })
  @ApiQuery({ name: 'priceType', required: false, description: 'Price type (fixed or hourly)' })
  async searchProviders(
    @Query('query') query?: string,
    @Query('experience') experience?: string,
    @Query('minRating') minRating?: string,
    @Query('location') location?: string,
    @Query('serviceType') serviceType?: string,
    @Query('serviceCategory') serviceCategory?: ServiceCategory,
    @Query('priceType') priceType?: string,
  ): Promise<ServiceProviders[]> {
    const filters: SearchProviderDto = {
      query: query || undefined,
      experience: experience ? this.parseNumber(experience) : undefined,
      minRating: minRating ? this.parseNumber(minRating) : undefined,
      location: location || undefined,
      serviceType: serviceType || undefined,
      serviceCategory: serviceCategory || undefined,
      priceType: priceType || undefined,
    };
    
    return this.serviceProviderService.search(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceProviders> {
    const serviceProvider = await this.serviceProviderService.findOne(+id);
    return serviceProvider;
  }

  @Get('name/:name')
  async findAllByName(@Param('name') name: string): Promise<ServiceProviders[]> {
    const serviceProviders = await this.serviceProviderService.findAll();
    return serviceProviders.filter(provider => 
      provider.user.first_name.toLowerCase().includes(name.toLowerCase()) ||
      provider.user.last_name.toLowerCase().includes(name.toLowerCase())
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get service provider by user ID' })
  async findByUserId(@Param('userId') userId: string): Promise<ServiceProviders> {
    const provider = await this.serviceProviderService.findByUserId(+userId);
    if (!provider) {
      throw new NotFoundException(`Service provider not found for user ID ${userId}`);
    }
    return provider;
  }

  @Post()
  async create(@Body() createDto: CreateServiceProviderDto): Promise<ServiceProviders> {
    return this.serviceProviderService.create(createDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateServiceProviderDto,
  ): Promise<ServiceProviders> {
    return this.serviceProviderService.update(+id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.serviceProviderService.remove(+id);
  }

  // Metodi di utilità per la conversione sicura dei tipi
  private parseNumber(value: string): number | undefined {
    if (!value || value.trim() === '') return undefined;
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  }
}