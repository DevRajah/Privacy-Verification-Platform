"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogService = void 0;
const auditLog_repository_1 = require("./auditLog.repository");
exports.auditLogService = {
    getUserAuditLogs: async (userId) => {
        return auditLog_repository_1.auditLogRepository.findUserAuditLogs(userId);
    },
    getProviderAuditLogs: async (providerId) => {
        return auditLog_repository_1.auditLogRepository.findProviderAuditLogs(providerId);
    },
};
