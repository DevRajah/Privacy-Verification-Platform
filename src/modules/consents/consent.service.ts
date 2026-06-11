import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError";
import { consentRepository } from "./consent.repository";

export const consentService = {
  getMyConsents: async (userId: string) => {
    return consentRepository.findConsentsForUser(userId);
  },

  approveConsent: async (consentId: string, userId: string) => {
    const consent = await consentRepository.findConsentById(consentId);

    if (!consent) {
      throw new AppError("Consent record not found", StatusCodes.NOT_FOUND);
    }

    if (consent.userId !== userId) {
      throw new AppError(
        "You cannot approve consent that does not belong to you.",
        StatusCodes.FORBIDDEN
      );
    }

    if (consent.status !== "PENDING") {
      throw new AppError(
        `Only PENDING consent can be approved. Current status is ${consent.status}.`,
        StatusCodes.BAD_REQUEST
      );
    }

    return consentRepository.approveConsent(consentId, userId);
  },

  rejectConsent: async (consentId: string, userId: string) => {
    const consent = await consentRepository.findConsentById(consentId);

    if (!consent) {
      throw new AppError("Consent record not found", StatusCodes.NOT_FOUND);
    }

    if (consent.userId !== userId) {
      throw new AppError(
        "You cannot reject consent that does not belong to you.",
        StatusCodes.FORBIDDEN
      );
    }

    if (consent.status !== "PENDING") {
      throw new AppError(
        `Only PENDING consent can be rejected. Current status is ${consent.status}.`,
        StatusCodes.BAD_REQUEST
      );
    }

    return consentRepository.rejectConsent(consentId, userId);
  },

  revokeConsent: async (consentId: string, userId: string) => {
    const consent = await consentRepository.findConsentById(consentId);

    if (!consent) {
      throw new AppError("Consent record not found", StatusCodes.NOT_FOUND);
    }

    if (consent.userId !== userId) {
      throw new AppError(
        "You cannot revoke consent that does not belong to you.",
        StatusCodes.FORBIDDEN
      );
    }

    if (consent.status !== "APPROVED") {
      throw new AppError(
        `Only APPROVED consent can be revoked. Current status is ${consent.status}.`,
        StatusCodes.BAD_REQUEST
      );
    }

    return consentRepository.revokeConsent(consentId, userId);
  },
};