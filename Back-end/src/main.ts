import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const portValue = configService.get<string>('PORT');
  const port = Number(portValue);
  console.log('hhhhhhhhhhhheeeeeeeeeeeeddscvs',port)

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(
      `Invalid PORT value: "${portValue}". Check your .env file.`,
    );
  }

  const frontendUrl =
    configService.get<string>('FRONTEND_URL') ??
    'http://localhost:5173';

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  await app.listen(port);

  const logger = new Logger('Bootstrap');

  logger.log('MediLink DZ backend started successfully');
  logger.log(`API: http://localhost:${port}/api/v1`);
  logger.log(`Health: http://localhost:${port}/api/v1/health`);
}

void bootstrap();