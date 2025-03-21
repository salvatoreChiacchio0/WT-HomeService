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
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService,private userService:UsersService) {}
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
      console.log('Attempting login for user:', signInDto.username);
      return this.authService.signIn(signInDto.username, signInDto.password);
    }
  
    @UseGuards(AuthGuard)
    @Post('user')
    getUser(@Body() email:string) {
      console.log(`Fetching user with email: ${email}`);
      return this.userService.findOne(email);
    }
  }
