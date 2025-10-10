// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Iniciando aplicación');
    console.log(
      '📡 DATABASE_URL:',
      process.env.DATABASE_URL ? '✅ Presente' : '❌ Faltante',
    );
    console.log('🔌 PORT variable:', process.env.PORT);

    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: [
        'http://localhost:3000',
        'https://tocadapp-landing.vercel.app/',
        'https://www.tocadapp.com',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    });

    const port = process.env.PORT || 3000;
    console.log(`🔄 Iniciando servidor en puerto ${port}...`);

    await app.listen(port, '0.0.0.0');
    console.log(`✅ Servidor ejecutándose en puerto ${port}`);
  } catch (error) {
    console.error('❌ Error crítico:', error);
    process.exit(1);
  }
}
bootstrap();
