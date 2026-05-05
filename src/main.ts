import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'node:path';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ApplicationExceptionFilter } from '@src/shared/infrastructure/http/filters/application-exception.filter';
import { AppModule } from '@src/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

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
  app.useStaticAssets(
    path.join(
      process.cwd(),
      configService.get<string>('LOCAL_STORAGE_ROOT_PATH', 'public/uploads'),
    ),
    {
      prefix: configService.get<string>('LOCAL_STORAGE_PUBLIC_URL', '/uploads'),
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ApplicationExceptionFilter());
  const port = configService.get<number>('api.port', 3000);
  await app.listen(port ?? 3000);
  Logger.log(`Server running on http://localhost:${port}/`, 'NestBootstrap');
}

void bootstrap();
