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
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService,private userService:UsersService) {}
  
    @Public()
    @ApiOperation({ summary: 'Login into HomeService',requestBody:{description:"Body",content:{} }})

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: LoginDto) {
      console.log('Attempting login for user:', signInDto.email);
      return this.authService.signIn(signInDto.email, signInDto.password);
    }
  
    @UseGuards(AuthGuard)
    @Post('user')
    getUser(@Body() email:string) {
      console.log(`Fetching user with email: ${email}`);
      return this.userService.findOne(email);
    }
  }
