"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationRequestService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../shared/errors/AppError");
const verificationRequest_repository_1 = require("./verificationRequest.repository");
exports.verificationRequestService = {
    createVerificationRequest: async (providerId, payload) => {
        // I first confirm that the target user exists.
        // A provider should not create a verification request for a user outside the platform.
        const user = await verificationRequest_repository_1.verificationRequestRepository.findUserByEmail(payload.userEmail);
        if (!user) {
            throw new AppError_1.AppError("User not found. The user must register before verification can be requested.", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        return verificationRequest_repository_1.verificationRequestRepository.createRequestWithConsent(providerId, user.id, payload);
    },
    getUserRequests: async (userId) => {
        return verificationRequest_repository_1.verificationRequestRepository.findRequestsForUser(userId);
    },
    getProviderRequests: async (providerId) => {
        return verificationRequest_repository_1.verificationRequestRepository.findRequestsForProvider(providerId);
    },
    getRequestById: async (requestId, loggedInAccountId, accountType) => {
        const request = await verificationRequest_repository_1.verificationRequestRepository.findRequestById(requestId);
        if (!request) {
            throw new AppError_1.AppError("Verification request not found", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        // I protect request details so users and providers can only view records that belong to them.
        if (accountType === "USER" && request.userId !== loggedInAccountId) {
            throw new AppError_1.AppError("You cannot view a verification request that does not belong to you.", http_status_codes_1.StatusCodes.FORBIDDEN);
        }
        if (accountType === "SERVICE_PROVIDER" &&
            request.providerId !== loggedInAccountId) {
            throw new AppError_1.AppError("You cannot view a verification request created by another provider.", http_status_codes_1.StatusCodes.FORBIDDEN);
        }
        return request;
    },
};
