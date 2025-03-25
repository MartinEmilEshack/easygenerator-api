import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiGatewayConfig } from './api-gateway-service';
import {
  AuthServiceDatabaseConfig,
  AuthServiceHostConfig,
  AuthServicePasswordHashConfig,
  AuthServiceTokensConfig,
} from './auth-service';
import { SysConfigsService } from './sys-configs.service';
import { SystemStateConfig } from './sys-state';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        AuthServiceDatabaseConfig,
        AuthServiceTokensConfig,
        AuthServicePasswordHashConfig,
        SystemStateConfig,
        ApiGatewayConfig,
        AuthServiceHostConfig,
      ],
    }),
  ],
  providers: [SysConfigsService],
  exports: [ConfigModule],
})
export class SysConfigsModule {}
