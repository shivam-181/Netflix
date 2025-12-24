import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. ENABLE CORS HERE
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Dynamic Origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. Enable Global Validation (Best Practice)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(5000);
}
bootstrap();