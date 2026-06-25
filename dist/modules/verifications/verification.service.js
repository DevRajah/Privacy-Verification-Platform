"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const database_1 = require("../../config/database");
const AppError_1 = require("../../shared/errors/AppError");
exports.verificationService = {
    getVerificationResult: async (requestId, providerId) => {
        const request = await database_1.prisma.verificationRequest.findUnique({
            where: {
                id: requestId,
            },
            include: {
                user: true,
                consent: true,
            },
        });
        if (!request) {
            throw new AppError_1.AppError("Verification request not found", http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        /**
         * I make sure providers cannot read
         * another provider's verification requests.
         */
        if (request.providerId !== providerId) {
            throw new AppError_1.AppError("You cannot access a verification request that belongs to another provider.", http_status_codes_1.StatusCodes.FORBIDDEN);
        }
        /**
         * This is the heart of the dissertation.
         *
         * Verification only happens if consent
         * has been explicitly approved.
         */
        if (!request.consent) {
            throw new AppError_1.AppError("No consent record exists for this request.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        // I check whether approved consent has passed its expiry time.
        // If it has expired, verification must stop.
        if (request.consent.expiresAt &&
            request.consent.expiresAt < new Date()) {
            await database_1.prisma.consent.update({
                where: {
                    id: request.consent.id,
                },
                data: {
                    status: client_1.ConsentStatus.EXPIRED,
                },
            });
            await database_1.prisma.verificationRequest.update({
                where: {
                    id: request.id,
                },
                data: {
                    status: "EXPIRED",
                },
            });
            throw new AppError_1.AppError("Consent has expired and verification is no longer permitted.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        switch (request.consent.status) {
            case client_1.ConsentStatus.PENDING:
                throw new AppError_1.AppError("Verification cannot be completed until consent is approved.", http_status_codes_1.StatusCodes.BAD_REQUEST);
            case client_1.ConsentStatus.REJECTED:
                throw new AppError_1.AppError("Verification request was rejected by the user.", http_status_codes_1.StatusCodes.BAD_REQUEST);
            case client_1.ConsentStatus.REVOKED:
                throw new AppError_1.AppError("Consent has been revoked and verification is no longer permitted.", http_status_codes_1.StatusCodes.BAD_REQUEST);
            case client_1.ConsentStatus.EXPIRED:
                throw new AppError_1.AppError("Consent has expired.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        /**
         * Fine-grained attribute filtering.
         *
         * Only the approved attribute is returned.
         * Nothing else leaves the system.
         */
        let result;
        switch (request.requestedAttribute) {
            case client_1.VerificationAttribute.STUDENT_STATUS:
                result = {
                    isActiveStudent: request.user.studentStatus,
                };
                break;
            case client_1.VerificationAttribute.HOUSING_ELIGIBILITY:
                result = {
                    isHousingEligible: request.user.housingEligible,
                };
                break;
            default:
                throw new AppError_1.AppError("Unsupported verification attribute.", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        await database_1.prisma.auditLog.create({
            data: {
                actorId: providerId,
                actorType: "SERVICE_PROVIDER",
                providerId,
                userId: request.userId,
                action: "VERIFICATION_RESPONSE_GENERATED",
                description: "Verification response generated using fine-grained attribute filtering",
                metadata: {
                    requestId,
                    requestedAttribute: request.requestedAttribute,
                },
            },
        });
        return {
            requestId: request.id,
            verifiedAttribute: request.requestedAttribute,
            result,
        };
    },
};
