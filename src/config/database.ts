import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "./env";

// I create one PostgreSQL connection pool for the whole backend.
// Prisma 7 needs this adapter so it knows how to connect to PostgreSQL.
const pool = new Pool({
  connectionString: env.databaseUrl,
});

// I pass the PostgreSQL adapter into PrismaClient.
// This replaces the old Prisma 6 style: new PrismaClient()
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});