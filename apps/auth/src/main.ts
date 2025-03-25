import { RpcWrapperHttpExceptionsFilter } from '@easygen/exceptions/filters/rpc-wrap-http.exp';
import { GrpcMessagesInterceptor } from '@easygen/logging';
import { getProtoPaths, ProtoPackage } from '@easygen/proto';
import { SysConfigsModule } from '@easygen/sys-configs';
import { AuthServiceHostConfigType } from '@easygen/sys-configs/auth-service';
import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

@Module({ imports: [SysConfigsModule] })
class BootstrapConfigModule {}

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(
    BootstrapConfigModule,
  );

  const configService = appContext.get(ConfigService);
  const grpcUrl = configService.get<AuthServiceHostConfigType>('grpc-url');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `${grpcUrl?.grpcHost}:${grpcUrl?.grpcPort}`,
        protoPath: getProtoPaths(ProtoPackage.AUTH, ProtoPackage.USERS_AUTH),
        package: [ProtoPackage.AUTH, ProtoPackage.USERS_AUTH],
      },
      logger: new ConsoleLogger({
        colors: true,
        timestamp: true,
        prefix: 'auth-service',
      }),
    },
  );

  app.useGlobalInterceptors(new GrpcMessagesInterceptor());
  app.useGlobalFilters(new RpcWrapperHttpExceptionsFilter());

  await app.listen();
}

void bootstrap();
