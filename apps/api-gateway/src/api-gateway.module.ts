import { SysConfigsModule } from '@easygen/sys-configs';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, SysConfigsModule],
})
export class ApiGatewayModule {}
