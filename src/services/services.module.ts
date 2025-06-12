import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../entities/services/services.entity';
import { ServiceProviders } from '../entities/service-provider/ServiceProviders.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { AdvancedSearchService } from './advanced-search.service';
import { ServiceProvidersModule } from '../service-provider/service-provider.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, ServiceProviders])
  ],
  controllers: [ServicesController],
  providers: [ServicesService, AdvancedSearchService],
  exports: [ServicesService]
})
export class ServicesModule {} 