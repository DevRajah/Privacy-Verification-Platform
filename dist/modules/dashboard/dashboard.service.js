"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const database_1 = require("../../config/database");
exports.dashboardService = {
    getUserSummary: async (userId) => {
        const [totalRequests, pendingConsents, approvedConsents, rejectedConsents, revokedConsents, recentRequests, recentAuditLogs,] = await Promise.all([
            database_1.prisma.verificationRequest.count({
                where: { userId },
            }),
            database_1.prisma.consent.count({
                where: { userId, status: "PENDING" },
            }),
            database_1.prisma.consent.count({
                where: { userId, status: "APPROVED" },
            }),
            database_1.prisma.consent.count({
                where: { userId, status: "REJECTED" },
            }),
            database_1.prisma.consent.count({
                where: { userId, status: "REVOKED" },
            }),
            database_1.prisma.verificationRequest.findMany({
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
            database_1.prisma.auditLog.findMany({
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
    getProviderSummary: async (providerId) => {
        const [totalRequests, pendingRequests, approvedRequests, completedRequests, revokedRequests, recentRequests, recentAuditLogs,] = await Promise.all([
            database_1.prisma.verificationRequest.count({
                where: { providerId },
            }),
            database_1.prisma.verificationRequest.count({
                where: { providerId, status: "PENDING" },
            }),
            database_1.prisma.verificationRequest.count({
                where: { providerId, status: "APPROVED" },
            }),
            database_1.prisma.verificationRequest.count({
                where: { providerId, status: "COMPLETED" },
            }),
            database_1.prisma.verificationRequest.count({
                where: { providerId, status: "REVOKED" },
            }),
            database_1.prisma.verificationRequest.findMany({
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
            database_1.prisma.auditLog.findMany({
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
        const [totalUsers, totalProviders, totalVerificationRequests, totalConsents, totalAuditLogs, pendingConsents, approvedConsents, rejectedConsents, revokedConsents, pendingRequests, approvedRequests, rejectedRequests, revokedRequests, completedRequests, expiredRequests, recentAuditLogs, recentVerificationRequests,] = await Promise.all([
            database_1.prisma.user.count(),
            database_1.prisma.serviceProvider.count(),
            database_1.prisma.verificationRequest.count(),
            database_1.prisma.consent.count(),
            database_1.prisma.auditLog.count(),
            database_1.prisma.consent.count({ where: { status: "PENDING" } }),
            database_1.prisma.consent.count({ where: { status: "APPROVED" } }),
            database_1.prisma.consent.count({ where: { status: "REJECTED" } }),
            database_1.prisma.consent.count({ where: { status: "REVOKED" } }),
            database_1.prisma.verificationRequest.count({ where: { status: "PENDING" } }),
            database_1.prisma.verificationRequest.count({ where: { status: "APPROVED" } }),
            database_1.prisma.verificationRequest.count({ where: { status: "REJECTED" } }),
            database_1.prisma.verificationRequest.count({ where: { status: "REVOKED" } }),
            database_1.prisma.verificationRequest.count({ where: { status: "COMPLETED" } }),
            database_1.prisma.verificationRequest.count({ where: { status: "EXPIRED" } }),
            database_1.prisma.auditLog.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
            }),
            database_1.prisma.verificationRequest.findMany({
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
