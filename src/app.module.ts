import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { User } from './entities/users/users.entity';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ChatGateway } from './chat/chat.gateway';
import { AdminReportsModule } from './admin-reports/admin-reports.module';
import { AdminReports } from './entities/admin-reports/admin_reports.entity';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { ServiceModule } from './services/service.module';

import { ChatController } from './chat/chat.controller';
import { Message } from './entities/chat/chat.entity';
import { ServiceProvModule } from './service-provider/service-prov.module';

import { ServiceProviders } from './entities/service-provider/ServiceProvider.entity';
import { ReviewsModule } from './reviews/review.module';
import { Review } from './entities/reviews/reviews.entity';
import { ReviewsService } from './reviews/reviews.service';
import { ServiceProviderService } from './service-provider/service-providers.service';
import { ServicesService } from './services/services.service';
import { ReviewsController } from './reviews/reviews.controller';
import { ServiceProvidersController } from './service-provider/service-providers.controller';
import { ServicesController } from './services/services.controller';
import { Service } from './entities/services/services.entity';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { BookingModule } from './booking/booking.module';
import { BookingController } from './booking/booking.controller';
import { BookingService } from './booking/booking.service';
import { Booking } from './entities/bookings/bookings.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      entities: ["dist/**/*.entity.js"],
      synchronize:false,
      // ssl:true,
    }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([User,AdminReports,Message,ServiceProviders,Review,Service,Booking]),
    ReviewsModule,
    ServiceProvModule,
    ServiceModule,
    AdminReportsModule,
    ChatModule,
    ConfigModule.forRoot(),
    RedisModule,
    BookingModule,
  ],
  controllers: [
    UsersController, 
    AuthController,
    ChatController,
    ReviewsController,
    ServiceProvidersController,
    ServicesController,
    BookingController
  ],
  providers: [
    UsersService, 
    AuthService, 
    ChatService,
    ReviewsService,
    ServiceProviderService,
    ServicesService,
    BookingService
  ],
})
export class AppModule {}