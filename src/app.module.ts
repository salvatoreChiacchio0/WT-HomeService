import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './entities/users/users.entity';
import { AuthModule } from './auth/auth.module';
import { AdminReports } from './entities/admin-reports/admin_reports.entity';
import { ChatModule } from './chat/chat.module';
import { Message } from './entities/chat/chat.entity';
import { ServiceProviders } from './entities/service-provider/ServiceProvider.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './entities/reviews/reviews.entity';
import { Service } from './entities/services/services.entity';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RecommendationModule } from './recommendation/recommendation.module';
import { Booking } from './entities/bookings/bookings.entity';
import { ProviderImage } from './entities/service-provider/ProviderImage.entity';
import { ProviderCertificate } from './entities/service-provider/ProviderCertificate.entity';
import { ProviderAvailability } from './entities/service-provider/ProviderAvailability.entity';
import { ServiceProvidersModule } from './service-provider/service-provider.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { AdminReportsModule } from './admin-reports/admin-reports.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'home_service',
      entities: [
        User,
        AdminReports,
        Message,
        ServiceProviders,
        Review,
        Service,
        Booking,
        ProviderImage,
        ProviderCertificate,
        ProviderAvailability
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ServiceProvidersModule,
    ServicesModule,
    BookingsModule,
    ReviewsModule,
    ChatModule,
    AdminReportsModule,
    RedisModule,
    RecommendationModule
  ],
})
export class AppModule {}