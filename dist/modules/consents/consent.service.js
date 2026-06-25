"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consentService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../shared/errors/AppError");
const consent_repository_1 = require("./consent.repository");
exports.consentService = {
    getMyConsents: async (userId) => {
        return consent_repository_1.consentRepository.findConsentsForUser(userId);
    },
    approveConsent: async (consentId, userId) => {
        const consent = await consent_repository_1.consentRepository.findConsentById(consentId);
        if (!consent) {
            throw new AppError_1.AppError("Consent record not found", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        if (consent.userId !== userId) {
            throw new AppError_1.AppError("You cannot approve consent that does not belong to you.", http_status_codes_1.StatusCodes.FORBIDDEN);
        }
        if (consent.status !== "PENDING") {
            throw new AppError_1.AppError(`Only PENDING consent can be approved. Current status is ${consent.status}.`, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        return consent_repository_1.consentRepository.approveConsent(consentId, userId);
    },
    rejectConsent: async (consentId, userId) => {
        const consent = await consent_repository_1.consentRepository.findConsentById(consentId);
        if (!consent) {
            throw new AppError_1.AppError("Consent record not found", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        if (consent.userId !== userId) {
            throw new AppError_1.AppError("You cannot reject consent that does not belong to you.", http_status_codes_1.StatusCodes.FORBIDDEN);
        }
        if (consent.status !== "PENDING") {
            throw new AppError_1.AppError(`Only PENDING consent can be rejected. Current status is ${consent.status}.`, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        return consent_repository_1.consentRepository.rejectConsent(consentId, userId);
    },
    revokeConsent: async (consentId, userId) => {
        const consent = await consent_repository_1.consentRepository.findConsentById(consentId);
        if (!consent) {
            throw new AppError_1.AppError("Consent record not found", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        if (consent.userId !== userId) {
            throw new AppError_1.AppError("You cannot revoke consent that does not belong to you.", http_status_codes_1.StatusCodes.FORBIDDEN);
        }
        if (consent.status !== "APPROVED") {
            throw new AppError_1.AppError(`Only APPROVED consent can be revoked. Current status is ${consent.status}.`, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        return consent_repository_1.consentRepository.revokeConsent(consentId, userId);
    },
};
