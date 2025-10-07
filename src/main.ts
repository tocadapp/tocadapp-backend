import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Iniciando aplicación...');
    console.log(
      '📡 DATABASE_URL:',
      process.env.DATABASE_URL ? '✅ Presente' : '❌ Faltante',
    );
    console.log('🔌 PORT variable:', process.env.PORT); // ← Agrega este log

    const app = await NestFactory.create(AppModule);

    // Configurar CORS
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://tocadapp.com',
        'https://www.tocadapp.com',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    });

    // ✅ CAMBIO IMPORTANTE: Usa process.env.PORT sin valor por defecto 4000
    const port = process.env.PORT || 3000; // Railway asigna el puerto automáticamente

    console.log(`🔄 Iniciando servidor en puerto ${port}...`);
    await app.listen(port);

    console.log(`✅ Servidor ejecutándose en puerto ${port}`);
  } catch (error: unknown) {
    console.error('❌ Error crítico al iniciar la aplicación:', error);

    // Manejo seguro del stack trace
    if (error instanceof Error) {
      console.error('🔍 Stack trace:', error.stack);
    }

    process.exit(1);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
