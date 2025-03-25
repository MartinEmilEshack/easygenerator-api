import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HttpRequest');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    this.logger.log(`${request.method} ${request.url}`);

    return next.handle();
  }
}
