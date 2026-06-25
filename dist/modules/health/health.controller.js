"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const database_1 = require("../../config/database");
const apiResponse_1 = require("../../shared/utils/apiResponse");
exports.healthController = {
    checkHealth: async (_req, res) => {
        // I use a lightweight database query to confirm the database connection works.
        await database_1.prisma.$queryRaw `SELECT 1`;
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "System health check passed", {
            api: "online",
            database: "connected",
            service: "Privacy Verification Platform",
            timestamp: new Date().toISOString(),
        });
    },
};
