import { rpcHttpCatch } from '@easygen/exceptions';
import { ProtoPackage } from '@easygen/proto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateUserDto,
  UpdateUserDto,
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'libs/proto/schemas/users.auth';

@Injectable()
export class UsersService implements OnModuleInit {
  private userAuthServiceClient: UserServiceClient;

  constructor(
    @Inject(ProtoPackage.USERS_AUTH) private readonly clientGrpc: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userAuthServiceClient =
      this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  create(createUserDto: CreateUserDto) {
    return this.userAuthServiceClient
      .createUser(createUserDto)
      .pipe(rpcHttpCatch);
  }

  findAll() {
    return this.userAuthServiceClient.findAllUsers({}).pipe(rpcHttpCatch);
  }

  findOne(id: string) {
    return this.userAuthServiceClient.findOneUser({ id }).pipe(rpcHttpCatch);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userAuthServiceClient
      .updateUser({ ...updateUserDto, id })
      .pipe(rpcHttpCatch);
  }

  remove(id: string) {
    return this.userAuthServiceClient.removeUser({ id }).pipe(rpcHttpCatch);
  }
}
