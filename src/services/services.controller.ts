import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { SearchServiceDto } from '../DTO/search-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll() {
    return this.servicesService.findAll();
  }

  @Get('search')
  async search(@Query() filters: SearchServiceDto) {
    return this.servicesService.search(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Post()
  async create(@Body() createServiceDto: any) {
    // Parse JSON fields

    const serviceData = {
      ...createServiceDto,
      pricing_model: createServiceDto.pricing_model,
      availability:createServiceDto.availability,
      requirements:createServiceDto.requirements,
      images: createServiceDto.images || null
    };

    return this.servicesService.create(serviceData);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateServiceDto: any) {
    
    const serviceData = {
      ...updateServiceDto,
      pricing_model: updateServiceDto.pricing_model ? updateServiceDto.pricing_model : null,
      availability: updateServiceDto.availability ? updateServiceDto.availability : null,
      requirements: updateServiceDto.requirements ? updateServiceDto.requirements : null,
      images: updateServiceDto.images ?updateServiceDto.images : null
    };
    return this.servicesService.update(+id, serviceData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.servicesService.delete(+id);
  }

  @Get('provider/:providerId')
  async findAllByProvider(@Param('providerId') providerId: string) {
    return this.servicesService.findAllServiceBySpId(+providerId);
  }
}