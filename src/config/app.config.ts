import { AppHttpExceptionFilter } from '@/modules/app/interface/exception-filter/exception-filter.filter';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupApp = (app: NestExpressApplication) => {
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.set('query parser', 'extended');

  app.useGlobalFilters(new AppHttpExceptionFilter());
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    }),
  );
};

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Backend Template')
    .setDescription('Backend Template API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
