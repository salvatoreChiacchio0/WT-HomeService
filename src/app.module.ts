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

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_CONN_STRING,
      entities: ["dist/**/*.entity.js"],
      synchronize:false,
      ssl:true,
    }),
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService],
})
export class AppModule {}