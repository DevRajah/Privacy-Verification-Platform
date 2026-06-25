"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogRepository = void 0;
const database_1 = require("../../config/database");
exports.auditLogRepository = {
    findUserAuditLogs: async (userId) => {
        return database_1.prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    },
    findProviderAuditLogs: async (providerId) => {
        return database_1.prisma.auditLog.findMany({
            where: { providerId },
            orderBy: { createdAt: "desc" },
        });
    },
};
