import { PrismaClient } from "@prisma/client";

// I create one Prisma client for the whole backend.
// This is the main bridge between my Express app and PostgreSQL.
export const prisma = new PrismaClient();