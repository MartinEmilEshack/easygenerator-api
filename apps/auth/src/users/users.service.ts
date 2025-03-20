import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(createUserDto: Pick<User, 'email' | 'password'>) {
    const user: User = {
      id: Date.now().toString(),
      email: createUserDto.email,
      password: createUserDto.password,
    };

    this.users.push(user);

    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const filteredUsers = this.users.filter((user) => user.id === id);

    if (filteredUsers.length)
      throw new NotFoundException(`User of id ${id} not found`);
    else return filteredUsers[0];
  }

  update(id: string, newUserData: Partial<Pick<User, 'email' | 'password'>>) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1)
      throw new NotFoundException(`User of id ${id} not found`);
    else {
      this.users[userIndex].email =
        newUserData.email ?? this.users[userIndex].email;

      this.users[userIndex].password =
        newUserData.password ?? this.users[userIndex].password;
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
