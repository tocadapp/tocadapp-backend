import { Module } from '@nestjs/common';
import { WaitlistModule } from './waitlist/waitlist.module';
import { AppController } from './app.controller'; // 👈 Agrega esta línea

@Module({
  imports: [WaitlistModule],
  controllers: [AppController], // 👈 Agrega aquí el controlador raíz
})
export class AppModule {}
