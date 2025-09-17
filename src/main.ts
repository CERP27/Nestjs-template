import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { setupApp, setupSwagger } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors(configService.get('frontend.url'));

  setupApp(app);
  setupSwagger(app);

  const port = configService.get('server.port');
  await app.listen(port);

  console.log(`Server is running on port ${port}`);
}
bootstrap();
