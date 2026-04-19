import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationExceptionFilter } from '@src/shared/infrastructure/http/filters/application-exception.filter';
import { AppModule } from '@src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('fitematch-api')
    .setDescription('API de gerenciamento do fitematch.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'JWT',
      },
      'JWT',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, documentFactory);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ApplicationExceptionFilter());
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('api.port', 3000);
  await app.listen(port ?? 3000);
  Logger.log(`Server running on http://localhost:${4000}/`, 'NestBootstrap');
}

void bootstrap();
