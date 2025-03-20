import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConsoleLogger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { getProtoPaths } from '@easygen/proto';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: getProtoPaths(__dirname, false, 'auth'),
        package: 'auth',
      },
      logger: new ConsoleLogger({
        colors: true,
        timestamp: true,
        prefix: 'auth-service',
      }),
    },
  );

  await app.listen();
}

void bootstrap();
