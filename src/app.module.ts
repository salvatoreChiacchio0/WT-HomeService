import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { Users } from './entities/users/users.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD?.toString(),
      database: process.env.DB_NAME,
      entities: [Users],
      synchronize: true,
    }),
    UsersModule,
    TypeOrmModule.forFeature([Users])
  ],
  controllers: [UsersController],
  providers: [ UsersService],
})
export class AppModule {}