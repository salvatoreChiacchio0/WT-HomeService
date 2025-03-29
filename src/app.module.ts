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
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, ChatGateway],
})
export class AppModule {}