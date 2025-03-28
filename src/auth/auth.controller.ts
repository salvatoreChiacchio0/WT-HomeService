import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from './auth.guard';
  import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Public } from './decorators/public.decorators';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from 'src/DTO/login-dto';
import { User } from 'src/entities/users/users.entity';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService,private userService:UsersService) {}
  
    @Public()
    @ApiOperation({ summary: 'Login into HomeService'})
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: LoginDto) {
      return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @Public()
    @ApiOperation({ summary: 'Register into HomeService'})
    @HttpCode(HttpStatus.OK)
    @Post('sign-up')
    signUp(@Body() user: User) {
      return this.authService.signUp(user);
    }

  }
