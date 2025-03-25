import { ProtoPackage } from '@easygen/proto';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'libs/proto/schemas/auth';
import { Observable, of } from 'rxjs';

import { Request } from 'express';
import { catchError, map, tap } from 'rxjs/operators';
import { RequestWithPayload } from './types/request-with-payload';

@Injectable()
export class HttpAuthGuard implements CanActivate, OnModuleInit {
  private authService: AuthServiceClient;

  constructor(
    @Inject(ProtoPackage.AUTH) private readonly clientGrpc: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.clientGrpc.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const jwt = request.headers.authorization?.split(' ')[1];

    if (!jwt) return false;

    return this.authService.getPayload({ token: jwt }).pipe(
      tap(
        (payload) =>
          (context.switchToHttp().getRequest<RequestWithPayload>().jwtPayload =
            payload),
      ),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
