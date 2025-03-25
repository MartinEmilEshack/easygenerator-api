import { HttpException } from '@nestjs/common';

export class RpcHttpClientException extends HttpException {
  constructor(name: string, message: string, status: number) {
    super(message, status);
    this.name = name;
  }
}
