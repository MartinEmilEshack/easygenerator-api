import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class GrpcMessagesInterceptor implements NestInterceptor {
  private readonly logger = new Logger('gRPC');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    context.switchToRpc();
    const handler = context.getHandler();
    const service = context.getClass().name;

    this.logger.log(`${service}.${handler.name} - request received`);

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${service}.${handler.name} - response sent`);
      }),
    );
  }
}
