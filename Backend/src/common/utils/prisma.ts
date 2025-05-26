// src/common/utils/prisma.ts
import { PrismaClient }  from '../../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// 📦 Singleton para evitar múltiples conexiones en desarrollo
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
