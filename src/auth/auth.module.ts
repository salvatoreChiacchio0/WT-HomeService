import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ServiceProvidersModule } from '../service-provider/service-provider.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users/users.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UsersModule,
    ServiceProvidersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'SalvatoreAlessandroNicoleClara',
      signOptions: { expiresIn: '10h' },
    }),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService, UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
