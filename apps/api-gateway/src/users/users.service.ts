import { ProtoPackage } from '@easygen/proto';
import {
  CreateUserDto,
  UpdateUserDto,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@easygen/proto/users-auth';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UsersService implements OnModuleInit {
  private userAuthService: UserServiceClient;

  constructor(@Inject(ProtoPackage.AUTH) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.userAuthService =
      this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  create(createUserDto: CreateUserDto) {
    return this.userAuthService.createUser(createUserDto);
  }

  findAll() {
    return this.userAuthService.findAllUsers({});
  }

  findOne(id: string) {
    return this.userAuthService.findOneUser({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userAuthService.updateUser({ ...updateUserDto, id });
  }

  remove(id: string) {
    return this.userAuthService.removeUser({ id });
  }
}
