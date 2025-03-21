import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users/users.entity';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: false,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([User])
    
  ],
  providers: [AuthService,UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
