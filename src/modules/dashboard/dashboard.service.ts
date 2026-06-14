import { prisma } from "../../config/database";

export const dashboardService = {
  getUserSummary: async (userId: string) => {
    const [
      totalRequests,
      pendingConsents,
      approvedConsents,
      rejectedConsents,
      revokedConsents,
      recentRequests,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.verificationRequest.count({
        where: { userId },
      }),

      prisma.consent.count({
        where: { userId, status: "PENDING" },
      }),

      prisma.consent.count({
        where: { userId, status: "APPROVED" },
      }),

      prisma.consent.count({
        where: { userId, status: "REJECTED" },
      }),

      prisma.consent.count({
        where: { userId, status: "REVOKED" },
      }),

      prisma.verificationRequest.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          provider: {
            select: {
              id: true,
              organisationName: true,
              email: true,
            },
          },
          consent: true,
        },
      }),

      prisma.auditLog.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      totalRequests,
      pendingConsents,
      approvedConsents,
      rejectedConsents,
      revokedConsents,
      recentRequests,
      recentAuditLogs,
    };
  },

  getProviderSummary: async (providerId: string) => {
    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      completedRequests,
      revokedRequests,
      recentRequests,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.verificationRequest.count({
        where: { providerId },
      }),

      prisma.verificationRequest.count({
        where: { providerId, status: "PENDING" },
      }),

      prisma.verificationRequest.count({
        where: { providerId, status: "APPROVED" },
      }),

      prisma.verificationRequest.count({
        where: { providerId, status: "COMPLETED" },
      }),

      prisma.verificationRequest.count({
        where: { providerId, status: "REVOKED" },
      }),

      prisma.verificationRequest.findMany({
        where: { providerId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,

              // I only expose minimal user context here.
              // The dashboard should not become a full identity disclosure surface.
              email: true,
            },
          },
          consent: true,
        },
      }),

      prisma.auditLog.findMany({
        where: { providerId },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      completedRequests,
      revokedRequests,
      recentRequests,
      recentAuditLogs,
    };
  },

  getAdminSummary: async () => {
    const [
      totalUsers,
      totalProviders,
      totalVerificationRequests,
      totalConsents,
      totalAuditLogs,

      pendingConsents,
      approvedConsents,
      rejectedConsents,
      revokedConsents,

      pendingRequests,
      approvedRequests,
      rejectedRequests,
      revokedRequests,
      completedRequests,
      expiredRequests,

      recentAuditLogs,
      recentVerificationRequests,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.serviceProvider.count(),
      prisma.verificationRequest.count(),
      prisma.consent.count(),
      prisma.auditLog.count(),

      prisma.consent.count({ where: { status: "PENDING" } }),
      prisma.consent.count({ where: { status: "APPROVED" } }),
      prisma.consent.count({ where: { status: "REJECTED" } }),
      prisma.consent.count({ where: { status: "REVOKED" } }),

      prisma.verificationRequest.count({ where: { status: "PENDING" } }),
      prisma.verificationRequest.count({ where: { status: "APPROVED" } }),
      prisma.verificationRequest.count({ where: { status: "REJECTED" } }),
      prisma.verificationRequest.count({ where: { status: "REVOKED" } }),
      prisma.verificationRequest.count({ where: { status: "COMPLETED" } }),
      prisma.verificationRequest.count({ where: { status: "EXPIRED" } }),

      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),

      prisma.verificationRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          provider: {
            select: {
              id: true,
              organisationName: true,
              email: true,
            },
          },
          consent: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalProviders,
      totalVerificationRequests,
      totalConsents,
      totalAuditLogs,
      consentBreakdown: {
        pending: pendingConsents,
        approved: approvedConsents,
        rejected: rejectedConsents,
        revoked: revokedConsents,
      },
      requestBreakdown: {
        pending: pendingRequests,
        approved: approvedRequests,
        rejected: rejectedRequests,
        revoked: revokedRequests,
        completed: completedRequests,
        expired: expiredRequests,
      },
      recentAuditLogs,
      recentVerificationRequests,
    };
  },
};