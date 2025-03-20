import { Controller } from '@nestjs/common';
import {
  CreateUserDto,
  FindOneUserDto,
  UpdateUserDto,
  UserServiceController,
  UserServiceControllerMethods,
} from '@easygen/proto/auth';
import { UsersService } from './users.service';

@Controller()
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
  constructor(private readonly usersService: UsersService) {}

  createUser(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  findAllUsers() {
    return this.usersService.findAll();
  }

  findOneUser(findOneDto: FindOneUserDto) {
    return this.usersService.findOne(findOneDto.id);
  }

  updateUser(updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  removeUser(findOneUser: FindOneUserDto) {
    return this.usersService.remove(findOneUser.id);
  }
}
