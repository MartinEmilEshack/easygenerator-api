import {
  CreateUserDto,
  FindOneUserDto,
  UpdateUserDto,
  UserDto,
  UsersDto,
  UserServiceController,
  UserServiceControllerMethods,
} from '@easygen/proto/users-auth';
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
  constructor(private readonly usersService: UsersService) {}

  createUser(createUserDto: CreateUserDto): UserDto {
    const user = this.usersService.create(createUserDto);

    return { id: user.id, email: user.email };
  }

  findAllUsers(): UsersDto {
    const users = this.usersService.findAll();

    return {
      users: users.map((user) => ({ id: user.id, email: user.email })),
    };
  }

  findOneUser(findOneDto: FindOneUserDto): UserDto {
    const user = this.usersService.findOne(findOneDto.id);

    return { id: user.id, email: user.email };
  }

  updateUser(updateUserDto: UpdateUserDto): UserDto {
    const user = this.usersService.update(updateUserDto.id, {
      email: updateUserDto.email,
      password: updateUserDto.password,
    });

    return { id: user.id, email: user.email };
  }

  removeUser(findOneUser: FindOneUserDto): UserDto {
    const user = this.usersService.remove(findOneUser.id);

    return { id: user.id, email: user.email };
  }
}
