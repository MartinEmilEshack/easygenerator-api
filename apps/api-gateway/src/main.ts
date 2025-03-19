import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

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
bootstrap();
