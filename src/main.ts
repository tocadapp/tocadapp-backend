import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS - ¡AGREGA ESTO!
  app.enableCors({
    origin: [
      'http://localhost:3000', // Desarrollo local
      'http://localhost:3001', // Alternativo local
      'https://tocadapp.com', // Tu dominio production
      'https://www.tocadapp.com', // WWW domain
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
