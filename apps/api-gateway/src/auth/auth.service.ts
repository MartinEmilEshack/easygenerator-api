import { rpcHttpCatch } from '@easygen/exceptions';
import { ProtoPackage } from '@easygen/proto';
import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'libs/proto/schemas/auth';

@Injectable()
export class AuthService implements OnModuleInit {
  private authServiceClient: AuthServiceClient;

  constructor(
    @Inject(ProtoPackage.AUTH) private readonly clientGrpc: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authServiceClient =
      this.clientGrpc.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  login(email: string, password: string) {
    return this.authServiceClient
      .login({
        email,
        password,
      })
      .pipe(rpcHttpCatch);
  }

  logout(userId: string) {
    return this.authServiceClient.logout({ userId }).pipe(rpcHttpCatch);
  }

  refresh(refreshToken?: string) {
    if (!refreshToken) throw new UnauthorizedException('User not logged in');
    return this.authServiceClient.refresh({ refreshToken }).pipe(rpcHttpCatch);
  }

  forgotPassword(userEmail: string) {
    return this.authServiceClient
      .forgotPassword({ email: userEmail })
      .pipe(rpcHttpCatch);
  }

  resetPassword(resetToken: string, newPassword: string) {
    return this.authServiceClient
      .resetPassword({
        resetToken,
        password: newPassword,
      })
      .pipe(rpcHttpCatch);
  }
}
