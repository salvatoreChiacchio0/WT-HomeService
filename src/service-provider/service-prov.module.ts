import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProviders } from 'src/entities/service-provider/ServiceProvider.entity';
import { ServiceProvidersController } from './service-providers.controller';
import { ServiceProviderService } from './service-providers.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProviders])],
  controllers: [ServiceProvidersController],
  providers: [ServiceProviderService],
})
export class ServiceProvModule {}