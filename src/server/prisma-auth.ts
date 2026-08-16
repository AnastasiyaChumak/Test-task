import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prismaAuth: PrismaClient | undefined;
};

const createClient = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const dbAuth = globalForPrisma.prismaAuth ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaAuth = dbAuth;