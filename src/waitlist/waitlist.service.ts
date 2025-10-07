import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class WaitlistService {
  private prisma: PrismaClient;

  constructor() {
    this.initializePrisma();
  }

  private initializePrisma(): void {
    try {
      console.log('🔧 Inicializando Prisma Client...');
      this.prisma = new PrismaClient({
        log: ['warn', 'error'],
        errorFormat: 'minimal',
      });
      console.log('✅ Prisma Client inicializado');
    } catch (error: unknown) {
      console.error('❌ Error inicializando Prisma:', error);
      // No throw, la app puede iniciar sin Prisma
    }
  }

  private async ensurePrisma(): Promise<boolean> {
    if (!this.prisma) {
      this.initializePrisma();
    }

    // Test connection
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error: unknown) {
      console.error('❌ Prisma no conectado:', error);
      return false;
    }
  }

  async addToWaitlist(email: string): Promise<{
    success: boolean;
    message: string;
    alreadyExists?: boolean;
    error?: string;
  }> {
    // Verificar que Prisma esté funcionando
    const isConnected = await this.ensurePrisma();
    if (!isConnected) {
      return {
        success: false,
        message: 'Sistema temporalmente no disponible. Intenta más tarde.',
      };
    }

    try {
      const existing = await this.prisma.waitlist.findUnique({
        where: { email },
      });

      if (existing) {
        return {
          success: true,
          message: '¡Ya estás en nuestra lista de espera!',
          alreadyExists: true,
        };
      }

      await this.prisma.waitlist.create({
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
    } catch (error: unknown) {
      console.error('Error en addToWaitlist:', error);

      // Manejo seguro del mensaje de error
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';

      return {
        success: false,
        message: 'Error al guardar tu email. Intenta de nuevo.',
        error: errorMessage,
      };
    }
  }

  async getWaitlistCount(): Promise<{
    success: boolean;
    count: number;
    error?: string;
  }> {
    try {
      const isConnected = await this.ensurePrisma();
      if (!isConnected) {
        return { success: false, count: 0, error: 'Database not connected' };
      }

      const count = await this.prisma.waitlist.count();
      return { success: true, count };
    } catch (error: unknown) {
      console.error('Error getting count:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      return { success: false, count: 0, error: errorMessage };
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect();
    }
  }
}
