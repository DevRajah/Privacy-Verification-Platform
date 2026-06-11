import { prisma } from "../../config/database";
import { CreateVerificationRequestInput } from "./verificationRequest.types";

export const verificationRequestRepository = {
  findUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  createRequestWithConsent: async (
    providerId: string,
    userId: string,
    payload: CreateVerificationRequestInput
  ) => {
    // I use a transaction because request creation and consent creation belong together.
    // If one fails, the other should not be saved alone.
    return prisma.$transaction(async (tx) => {
      const verificationRequest = await tx.verificationRequest.create({
        data: {
          providerId,
          userId,
          requestedAttribute: payload.requestedAttribute,
          purpose: payload.purpose,
          status: "PENDING",
        },
      });

      const consent = await tx.consent.create({
        data: {
          verificationRequestId: verificationRequest.id,
          userId,
          status: "PENDING",
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: providerId,
          actorType: "SERVICE_PROVIDER",
          providerId,
          userId,
          action: "VERIFICATION_REQUEST_CREATED",
          description: `Service provider created a verification request for ${payload.requestedAttribute}`,
          metadata: {
            verificationRequestId: verificationRequest.id,
            consentId: consent.id,
            requestedAttribute: payload.requestedAttribute,
            purpose: payload.purpose,
          },
        },
      });

      return {
        verificationRequest,
        consent,
      };
    });
  },

  findRequestsForUser: async (userId: string) => {
    return prisma.verificationRequest.findMany({
      where: { userId },
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
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findRequestsForProvider: async (providerId: string) => {
    return prisma.verificationRequest.findMany({
      where: { providerId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
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

  findRequestById: async (requestId: string) => {
    return prisma.verificationRequest.findUnique({
      where: { id: requestId },
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
    });
  },
};