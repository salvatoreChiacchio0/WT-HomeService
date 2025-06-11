import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/users/users.entity';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorators';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiProperty({})
  @Get()
  findAll() {
    console.log('Fetching all users');
    return this.usersService.findAll();
  }

  @Get('id/:id')
  findOneById(@Param('id') id: string) {
    console.log(`Fetching user with id: ${id}`);
    return this.usersService.findOneById(+id);
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    console.log(`Fetching user with email: ${email}`);
    return this.usersService.findOne(email);
  }

  @Post()
  create(@Body() user: User) {
    console.log('Creating user:', user);
    return this.usersService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: User) {
    console.log(`Updating user with id: ${id}`, user);
    return this.usersService.update(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(`Deleting user with id: ${id}`);
    return this.usersService.delete(+id);
  }

  @Get('search/:partialUsername')
  findByUsernameLike(@Param('partialUsername') partial: string) {
    console.log(`Searching users with username containing: ${partial}`);
    return this.usersService.findByUsernameLike(partial);
  }
}