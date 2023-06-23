import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './exception/global-exception.filter';

async function bootstrap() {
  const env = 'development';
  const result = config({ path: `.env.${env}` });

  if (result.error) {
    throw result.error;
  }

  const app = await NestFactory.create(AppModule);

  // Check database connection
  const logger = new Logger('Application');
  try {
    await app.listen(3000);
    logger.log('Application is listening on port 3000');
    logger.log('[Main] Connected to the database');
  } catch (error) {
    logger.error(`Failed to start the application: ${error}`);
  }

  // Register global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
}

bootstrap();