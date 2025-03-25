import { SysConfigsModule } from '@easygen/sys-configs';
import { AuthServiceDatabaseConfig } from '@easygen/sys-configs/auth-service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserTokenModule } from './user-token/user-token.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    UserTokenModule,
    SysConfigsModule,
    MongooseModule.forRootAsync(AuthServiceDatabaseConfig.asProvider()),
    JwtModule.register({ global: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
