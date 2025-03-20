import { HttpRequestLoggerInterceptor } from '@easygen/logging';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, {
    logger: new ConsoleLogger({
      colors: true,
      timestamp: true,
      prefix: 'api-gateway',
    }),
  });

  app.useGlobalInterceptors(new HttpRequestLoggerInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Easygenerator API')
    .setVersion('1.0')
    .setDescription('A test API for easygenerator fullstack engineer position')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      autoTagControllers: true,
    });

  SwaggerModule.setup('/api-swagger', app, documentFactory);

  await app.listen(process.env.port ?? 3000);
}

void bootstrap();
