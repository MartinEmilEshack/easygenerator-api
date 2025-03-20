import { CreateUserDto, UpdateUserDto, User } from '@easygen/proto/auth';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const user: User = {
      id: Date.now().toString(),
      email: createUserDto.email,
      password: createUserDto.password,
      username: createUserDto.username,
    };

    this.users.push(user);

    return user;
  }

  findAll() {
    return { users: this.users };
  }

  findOne(id: string) {
    return this.users.filter((user) => user.id === id)[0];
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1)
      throw new NotFoundException(`User of id ${updateUserDto.id} not found`);
    else {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updateUserDto,
      };
    }

    return this.users[userIndex];
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1)
      throw new NotFoundException(`User of id ${id} not found`);
    else {
      return this.users.splice(userIndex)[0];
    }
  }
}
