import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users/users.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<Users> {
    const user = await this.usersRepository.findOneBy({ user_id: id });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async create(user: Partial<Users>): Promise<Users> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, user: Partial<Users>): Promise<Users> {
    await this.usersRepository.update(id, user);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}