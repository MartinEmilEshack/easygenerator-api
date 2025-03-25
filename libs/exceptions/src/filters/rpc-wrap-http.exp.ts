import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { RpcHttpException } from '../rpc-http-exp';

@Catch(HttpException)
export class RpcWrapperHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    throw new RpcHttpException(exception);
  }
}
