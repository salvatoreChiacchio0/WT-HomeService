import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Request,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Public } from './decorators/public.decorators';
import { ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { LoginDto } from 'src/DTO/login-dto';
import { User } from 'src/entities/users/users.entity';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService,private userService:UsersService) {}
  
    @Public()
    @ApiOperation({ summary: 'Login into HomeService'})
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: LoginDto) {
      return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @Public()
    @ApiOperation({ summary: 'Register into HomeService'})
    @ApiConsumes('multipart/form-data')
    @HttpCode(HttpStatus.CREATED)
    @Post('sign-up')
    @UseInterceptors(FileInterceptor('profile_photo'))
    async signUp(
      @Body() userData: any,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
            new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
          ],
          fileIsRequired: false,
        }),
      )
      file?: Express.Multer.File,
    ) {
      if (file) {
        userData.profile_photo = file.buffer;
      }
      console.log("signup",userData)
      return this.authService.signUp(userData);
    }

  }
