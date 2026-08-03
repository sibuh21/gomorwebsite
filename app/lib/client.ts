// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create prisma client only if DATABASE_URL exists
let prisma: PrismaClient;

try {
  if (process.env.DATABASE_URL) {
    prisma = globalForPrisma.prisma || new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    });
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
  } else {
    throw new Error('DATABASE_URL not set');
  }
} catch (error) {
  console.warn('Prisma client initialization failed:', error instanceof Error ? error.message : 'Unknown error');
  // Export a dummy object that returns empty arrays
  prisma = {
    project: {
      findMany: async () => [],
      findFirst: async () => null,
      // Add other methods as needed
    },
  } as any;
}

export default prisma;