"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const database_1 = require("../../config/database");
exports.adminService = {
    getAllAuditLogs: async () => {
        return database_1.prisma.auditLog.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    getAllVerificationRequests: async () => {
        return database_1.prisma.verificationRequest.findMany({
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
        const [totalUsers, totalProviders, totalVerificationRequests, totalConsents, totalAuditLogs, pendingConsents, approvedConsents, rejectedConsents, revokedConsents,] = await Promise.all([
            database_1.prisma.user.count(),
            database_1.prisma.serviceProvider.count(),
            database_1.prisma.verificationRequest.count(),
            database_1.prisma.consent.count(),
            database_1.prisma.auditLog.count(),
            database_1.prisma.consent.count({ where: { status: "PENDING" } }),
            database_1.prisma.consent.count({ where: { status: "APPROVED" } }),
            database_1.prisma.consent.count({ where: { status: "REJECTED" } }),
            database_1.prisma.consent.count({ where: { status: "REVOKED" } }),
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
