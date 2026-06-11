import { auditLogRepository } from "./auditLog.repository";

export const auditLogService = {
  getUserAuditLogs: async (userId: string) => {
    return auditLogRepository.findUserAuditLogs(userId);
  },

  getProviderAuditLogs: async (providerId: string) => {
    return auditLogRepository.findProviderAuditLogs(providerId);
  },
};