import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // ✅ FULLY FIXED CORS (ngrok + web + mobile safe)
  app.enableCors({
    origin: true, // allow all origins (dev)
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'], // ✅ FIXED
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'ngrok-skip-browser-warning', // ✅ required for ngrok
    ],
    credentials: true,
    optionsSuccessStatus: 204, // ✅ helps some browsers
  });

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`✅ Backend running on http://localhost:${port}`);
}

bootstrap();