import { prisma } from "../../config/database";

export const consentRepository = {
    findConsentById: async (consentId: string) => {
        return prisma.consent.findUnique({
            where: { id: consentId },
            include: {
                verificationRequest: {
                    include: {
                        provider: {
                            select: {
                                id: true,
                                organisationName: true,
                                email: true,
                            },
                        },
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
    },

    findConsentsForUser: async (userId: string) => {
        return prisma.consent.findMany({
            where: { userId },
            include: {
                verificationRequest: {
                    include: {
                        provider: {
                            select: {
                                id: true,
                                organisationName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    approveConsent: async (consentId: string, userId: string) => {
        return prisma.$transaction(async (tx) => {
            const consent = await tx.consent.update({
                where: { id: consentId },
                data: {
                    status: "APPROVED",
                    approvedAt: new Date(),
                },
                include: {
                    verificationRequest: true,
                },
            });

            const verificationRequest = await tx.verificationRequest.update({
                where: { id: consent.verificationRequestId },
                data: {
                    status: "APPROVED",
                    approvedAt: new Date(),

                    // I give approved consent a clear expiry window.
                    // This supports consent lifecycle management because approval should not last forever.
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            });

            await tx.auditLog.create({
                data: {
                    actorId: userId,
                    actorType: "USER",
                    userId,
                    providerId: verificationRequest.providerId,
                    action: "CONSENT_APPROVED",
                    description: "User approved consent for verification request",
                    metadata: {
                        consentId,
                        verificationRequestId: verificationRequest.id,
                        requestedAttribute: verificationRequest.requestedAttribute,
                    },
                },
            });

            return {
                consent,
                verificationRequest,
            };
        });
    },

    rejectConsent: async (consentId: string, userId: string) => {
        return prisma.$transaction(async (tx) => {
            const consent = await tx.consent.update({
                where: { id: consentId },
                data: {
                    status: "REJECTED",
                    rejectedAt: new Date(),
                },
                include: {
                    verificationRequest: true,
                },
            });

            const verificationRequest = await tx.verificationRequest.update({
                where: { id: consent.verificationRequestId },
                data: {
                    status: "REJECTED",
                },
            });

            await tx.auditLog.create({
                data: {
                    actorId: userId,
                    actorType: "USER",
                    userId,
                    providerId: verificationRequest.providerId,
                    action: "CONSENT_REJECTED",
                    description: "User rejected consent for verification request",
                    metadata: {
                        consentId,
                        verificationRequestId: verificationRequest.id,
                        requestedAttribute: verificationRequest.requestedAttribute,
                    },
                },
            });

            return {
                consent,
                verificationRequest,
            };
        });
    },

    revokeConsent: async (consentId: string, userId: string) => {
        return prisma.$transaction(async (tx) => {
            const consent = await tx.consent.update({
                where: { id: consentId },
                data: {
                    status: "REVOKED",
                    revokedAt: new Date(),
                },
                include: {
                    verificationRequest: true,
                },
            });

            const verificationRequest = await tx.verificationRequest.update({
                where: { id: consent.verificationRequestId },
                data: {
                    status: "REVOKED",
                },
            });

            await tx.auditLog.create({
                data: {
                    actorId: userId,
                    actorType: "USER",
                    userId,
                    providerId: verificationRequest.providerId,
                    action: "CONSENT_REVOKED",
                    description: "User revoked previously approved consent",
                    metadata: {
                        consentId,
                        verificationRequestId: verificationRequest.id,
                        requestedAttribute: verificationRequest.requestedAttribute,
                    },
                },
            });

            return {
                consent,
                verificationRequest,
            };
        });
    },
};