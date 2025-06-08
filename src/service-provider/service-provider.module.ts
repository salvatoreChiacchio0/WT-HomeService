import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProvider.entity';
import { ServiceProviderService } from './service-providers.service';
import { ServiceProvidersController } from './service-providers.controller';
import { Service } from 'src/entities/services/services.entity';
import { ProviderImage } from 'src/entities/service-provider/ProviderImage.entity';
import { ProviderCertificate } from 'src/entities/service-provider/ProviderCertificate.entity';
import { ProviderAvailability } from 'src/entities/service-provider/ProviderAvailability.entity';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { AvailabilityService } from '../services/availability.service';
import { AvailabilityController } from './availability.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      ServiceProviders,
      Service,
      ProviderImage,
      ProviderCertificate,
      ProviderAvailability
    ]),
  ],
  controllers: [ServiceProvidersController, FileUploadController, AvailabilityController],
  providers: [ServiceProviderService, FileUploadService, AvailabilityService],
  exports: [ServiceProviderService, FileUploadService, AvailabilityService],
})
export class ServiceProvidersModule {} 