import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/users/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    console.log('Fetching all users');
    return this.usersService.findAll();
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    console.log(`Fetching user with email: ${email}`);
    return this.usersService.findOne(email);
  }

  @HttpCode(HttpStatus.OK)
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
}