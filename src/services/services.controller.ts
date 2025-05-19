import { Controller, Get, Post, Put, Delete, Param, Body, Query, Logger, ValidationPipe } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from 'src/entities/services/services.entity';
import { CreateServiceDto } from 'src/DTO/create-service.dto';
import { UpdateServiceDto } from 'src/DTO/update-service.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
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

  @ApiOperation({ summary: 'Search services with optional filters' })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'serviceCategory', required: false, type: String })
  @ApiQuery({ name: 'price', required: false, type: Number })
  @ApiQuery({ name: 'rating', required: false, type: Number })
  @ApiQuery({ name: 'availability', required: false, type: Boolean })
  @Get('search')
  async search(
    @Query('name') name?: string,
    @Query('serviceCategory') serviceCategory?: string,
    @Query('price') price?: number,
    @Query('rating') rating?: number,
    @Query('availability') availability?: boolean,
  ): Promise<Service[]> {
    this.logger.debug(`Search params - name: ${name}, category: ${serviceCategory}, price: ${price}, rating: ${rating}, availability: ${availability}`);
    
    const searchDTO = new SearchServiceDto();
    searchDTO.name = name;
    searchDTO.serviceCategory = serviceCategory;
    searchDTO.price = price;
    searchDTO.rating = rating;
    searchDTO.availability = availability;
    
    return this.servicesService.search(searchDTO);
  }

  @Get('ServiceProvider/:id')
  async findAllServiceBySpId(@Param('id') id: number) {
    return this.servicesService.findAllServiceBySpId(id);
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
}