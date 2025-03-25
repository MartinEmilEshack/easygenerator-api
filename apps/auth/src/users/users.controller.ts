import { Controller } from '@nestjs/common';
import {
  CreateUserDto,
  FindOneUserDto,
  UpdateUserDto,
  UserDto,
  UsersDto,
  UserServiceController,
  UserServiceControllerMethods,
} from 'libs/proto/schemas/users.auth';
import { UsersService } from './users.service';

@Controller()
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
  constructor(private readonly usersService: UsersService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.create(
      createUserDto.email,
      createUserDto.password,
    );

    return { id: user._id.toString(), email: user.email };
  }

  async findAllUsers(): Promise<UsersDto> {
    const users = await this.usersService.findAll();

    return {
      users: users.map((user) => ({
        id: user._id.toString(),
        email: user.email,
      })),
    };
  }

  async findOneUser(findOneDto: FindOneUserDto): Promise<UserDto> {
    const user = await this.usersService.findOne(findOneDto.id);

    return { id: user._id.toString(), email: user.email };
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.usersService.update(updateUserDto.id, {
      email: updateUserDto.email,
      password: updateUserDto.password,
    });

    return { id: user._id.toString(), email: user.email };
  }

  async removeUser(findOneUser: FindOneUserDto): Promise<UserDto> {
    const user = await this.usersService.remove(findOneUser.id);

    return { id: user._id.toString(), email: user.email };
  }
}
