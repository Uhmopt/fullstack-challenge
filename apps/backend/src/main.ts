import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Enable CORS with correct settings
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow frontend
    credentials: true, // Allow cookies/auth headers
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
