import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // required — better auth handles its own body parsing
  });

  // === CORS CONFIG ===
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
  console.log(`Server running on http://localhost:${process.env.PORT ?? 5000}`);
}
bootstrap();
