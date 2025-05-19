import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Query, Logger } from '@nestjs/common';
import { ServiceProviderService } from './service-providers.service';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProvider.entity';
import { CreateServiceProviderDto } from 'src/DTO/create-service-provider.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchServiceProviderDto } from 'src/DTO/search-service-provider.dto';

@Controller('service-providers')
@ApiBearerAuth()
export class ServiceProvidersController {
  private readonly logger = new Logger(ServiceProvidersController.name);

  constructor(private readonly serviceProviderService: ServiceProviderService) {}

  @Get()
  async findAll(): Promise<ServiceProviders[]> {
    return this.serviceProviderService.findAll();
  }

  @ApiOperation({ summary: 'Search service providers with optional filters' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Name of the service provider' })
  @ApiQuery({ name: 'availability', required: false, type: String, description: 'Availability status' })
  @ApiQuery({ name: 'experience_years', required: false, type: Number, description: 'Minimum years of experience' })
  @Get('search')
  async search(
    @Query('name') name?: string,
    @Query('availability') availability?: string,
    @Query('experience_years') experience_years?: number,
  ): Promise<ServiceProviders[]> {
    this.logger.debug(`Search params - name: ${name}, availability: ${availability}, experience_years: ${experience_years}`);
    
    const searchDTO = new SearchServiceProviderDto();
    searchDTO.name = name;
    searchDTO.availability = availability;
    searchDTO.experience_years = experience_years;
    
    return this.serviceProviderService.search(searchDTO);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ServiceProviders> {
    const serviceProvider = await this.serviceProviderService.findOne(+id);
    if (!serviceProvider) {
      throw new NotFoundException(`Service provider with ID ${id} not found`);
    }
    return serviceProvider;
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
}