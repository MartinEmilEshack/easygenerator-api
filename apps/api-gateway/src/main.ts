import { HttpRequestLoggerInterceptor } from '@easygen/logging';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, {
    cors: true,
    logger: new ConsoleLogger({
      colors: true,
      timestamp: true,
      prefix: 'api-gateway',
    }),
  });

  const sysConfig = app.get(ConfigService);

  app.useGlobalInterceptors(new HttpRequestLoggerInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Easygenerator API')
    .setVersion('1.0')
    .setDescription('A test API for easygenerator fullstack engineer position')
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig, {
      autoTagControllers: true,
    });

  if (sysConfig.get('api-gateway.enableSwagger'))
    SwaggerModule.setup('/api-swagger', app, documentFactory);

  app.enableCors({
    origin: sysConfig.get('api-gateway.originPattern'),
    methods: sysConfig.get('api-gateway.originMethods'),
    preflightContinue: sysConfig.get('api-gateway.preflightContinue'),
    optionsSuccessStatus: sysConfig.get('api-gateway.optionsSuccessStatus'),
  });
  await app.listen(sysConfig.get('api-gateway.port') ?? '');
}

void bootstrap();
