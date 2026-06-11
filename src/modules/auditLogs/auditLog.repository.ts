import { prisma } from "../../config/database";

export const auditLogRepository = {
  findUserAuditLogs: async (userId: string) => {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  findProviderAuditLogs: async (providerId: string) => {
    return prisma.auditLog.findMany({
      where: { providerId },
      orderBy: { createdAt: "desc" },
    });
  },
};