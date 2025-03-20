import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { HttpRequest } from 'libs/logging/@types/http-request';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HttpRequest');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<HttpRequest>();

    this.logger.log(`${request.method} ${request.url}`);

    return next.handle();
  }
}
