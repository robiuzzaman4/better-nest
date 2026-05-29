import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // required — better auth handles its own body parsing
  });

  // === GRACEFUL SHUTDOWN ===
  // This ensures the server cleanly closes connections and frees the port on restart
  app.enableShutdownHooks();

  // === GLOBAL API PREFIX ===
  app.setGlobalPrefix('api/v1');

  // === CORS CONFIG ===
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  await app.listen(env.PORT);
  console.log(`Server running on http://localhost:${env.PORT}`);
}
bootstrap();
