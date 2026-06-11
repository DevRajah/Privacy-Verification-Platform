import { prisma } from "../../config/database";

export const adminService = {
  getAllAuditLogs: async () => {
    return prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getAllVerificationRequests: async () => {
    return prisma.verificationRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getPlatformSummary: async () => {
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
    };
  },
};