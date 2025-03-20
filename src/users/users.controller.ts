import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from 'src/entities/users/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() user: Users) {
    return this.usersService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: Users) {
    return this.usersService.update(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}