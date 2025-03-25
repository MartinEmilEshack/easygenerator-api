import { HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class RpcHttpException extends RpcException {
  constructor(httpExp: HttpException) {
    super(JSON.stringify(httpExp));
  }
}
