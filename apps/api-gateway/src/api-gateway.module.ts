import { SysConfigsModule } from '@easygen/sys-configs';
import { Module } from '@nestjs/common';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      // general rate limit as testing the endpoints will most propably break all rate limits
      throttlers: [{ ttl: seconds(60), limit: 10 }],
    }),
    AuthModule,
    UsersModule,
    SysConfigsModule,
  ],
})
export class ApiGatewayModule {}
