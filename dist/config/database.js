"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const env_1 = require("./env");
// I create one PostgreSQL connection pool for the whole backend.
// Prisma 7 needs this adapter so it knows how to connect to PostgreSQL.
const pool = new pg_1.Pool({
    connectionString: env_1.env.databaseUrl,
});
// I pass the PostgreSQL adapter into PrismaClient.
// This replaces the old Prisma 6 style: new PrismaClient()
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.prisma = new client_1.PrismaClient({
    adapter,
});
