import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { ServiceProviderService } from './service-providers.service';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProvider.entity';
import { CreateServiceProviderDto } from 'src/DTO/create-service-provider.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('service-providers')
@ApiBearerAuth()
export class ServiceProvidersController {
  constructor(private readonly serviceProviderService: ServiceProviderService) {}

  @Get()
  async findAll(): Promise<ServiceProviders[]> {
    return this.serviceProviderService.findAll();
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