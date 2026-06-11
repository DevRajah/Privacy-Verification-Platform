import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError";
import { CreateVerificationRequestInput } from "./verificationRequest.types";
import { verificationRequestRepository } from "./verificationRequest.repository";

export const verificationRequestService = {
  createVerificationRequest: async (
    providerId: string,
    payload: CreateVerificationRequestInput
  ) => {
    // I first confirm that the target user exists.
    // A provider should not create a verification request for a user outside the platform.
    const user = await verificationRequestRepository.findUserByEmail(
      payload.userEmail
    );

    if (!user) {
      throw new AppError(
        "User not found. The user must register before verification can be requested.",
        StatusCodes.NOT_FOUND
      );
    }

    return verificationRequestRepository.createRequestWithConsent(
      providerId,
      user.id,
      payload
    );
  },

  getUserRequests: async (userId: string) => {
    return verificationRequestRepository.findRequestsForUser(userId);
  },

  getProviderRequests: async (providerId: string) => {
    return verificationRequestRepository.findRequestsForProvider(providerId);
  },

  getRequestById: async (
    requestId: string,
    loggedInAccountId: string,
    accountType: "USER" | "SERVICE_PROVIDER"
  ) => {
    const request = await verificationRequestRepository.findRequestById(
      requestId
    );

    if (!request) {
      throw new AppError("Verification request not found", StatusCodes.NOT_FOUND);
    }

    // I protect request details so users and providers can only view records that belong to them.
    if (accountType === "USER" && request.userId !== loggedInAccountId) {
      throw new AppError(
        "You cannot view a verification request that does not belong to you.",
        StatusCodes.FORBIDDEN
      );
    }

    if (
      accountType === "SERVICE_PROVIDER" &&
      request.providerId !== loggedInAccountId
    ) {
      throw new AppError(
        "You cannot view a verification request created by another provider.",
        StatusCodes.FORBIDDEN
      );
    }

    return request;
  },
};