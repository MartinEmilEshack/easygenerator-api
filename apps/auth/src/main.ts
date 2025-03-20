import { GrpcMessagesInterceptor } from '@easygen/logging';
import { getProtoPaths, ProtoPackage } from '@easygen/proto';
import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: getProtoPaths(__dirname, false, ProtoPackage.AUTH),
        package: ProtoPackage.AUTH,
      },
      logger: new ConsoleLogger({
        colors: true,
        timestamp: true,
        prefix: 'auth-service',
      }),
    },
  );

  app.useGlobalInterceptors(new GrpcMessagesInterceptor());

  await app.listen();
}

void bootstrap();
