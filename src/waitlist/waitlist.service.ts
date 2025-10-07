import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class WaitlistService {
  async addToWaitlist(email: string) {
    try {
      // Verificar si el email ya existe
      const existing = await prisma.waitlist.findUnique({
        where: { email },
      });

      if (existing) {
        return {
          success: true,
          message: '¡Ya estás en nuestra lista de espera!',
          alreadyExists: true,
        };
      }

      // Crear nuevo registro
      await prisma.waitlist.create({
        data: {
          email,
          source: 'landing_page',
        },
      });

      return {
        success: true,
        message: '¡Perfecto! Te avisaremos cuando TocadApp esté listo.',
        alreadyExists: false,
      };
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      return {
        success: false,
        message: 'Error al guardar tu email. Intenta de nuevo.',
      };
    }
  }

  async getWaitlistCount() {
    try {
      const count = await prisma.waitlist.count();
      return { success: true, count };
    } catch (error) {
      return { success: false, count: 0 };
    }
  }
}
