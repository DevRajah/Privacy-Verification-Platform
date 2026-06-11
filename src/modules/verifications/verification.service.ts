import {
    ConsentStatus,
    VerificationAttribute,
} from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/database";
import { AppError } from "../../shared/errors/AppError";

export const verificationService = {
    getVerificationResult: async (
        requestId: string,
        providerId: string
    ) => {
        const request = await prisma.verificationRequest.findUnique({
            where: {
                id: requestId,
            },
            include: {
                user: true,
                consent: true,
            },
        });

        if (!request) {
            throw new AppError(
                "Verification request not found",
                StatusCodes.NOT_FOUND
            );
        }

        /**
         * I make sure providers cannot read
         * another provider's verification requests.
         */
        if (request.providerId !== providerId) {
            throw new AppError(
                "You cannot access a verification request that belongs to another provider.",
                StatusCodes.FORBIDDEN
            );
        }

        /**
         * This is the heart of the dissertation.
         *
         * Verification only happens if consent
         * has been explicitly approved.
         */
        if (!request.consent) {
            throw new AppError(
                "No consent record exists for this request.",
                StatusCodes.BAD_REQUEST
            );
        }

        switch (request.consent.status) {
            case ConsentStatus.PENDING:
                throw new AppError(
                    "Verification cannot be completed until consent is approved.",
                    StatusCodes.BAD_REQUEST
                );

            case ConsentStatus.REJECTED:
                throw new AppError(
                    "Verification request was rejected by the user.",
                    StatusCodes.BAD_REQUEST
                );

            case ConsentStatus.REVOKED:
                throw new AppError(
                    "Consent has been revoked and verification is no longer permitted.",
                    StatusCodes.BAD_REQUEST
                );

            case ConsentStatus.EXPIRED:
                throw new AppError(
                    "Consent has expired.",
                    StatusCodes.BAD_REQUEST
                );
        }

        /**
         * Fine-grained attribute filtering.
         *
         * Only the approved attribute is returned.
         * Nothing else leaves the system.
         */
        let result: Record<string, boolean>;

        switch (request.requestedAttribute) {
            case VerificationAttribute.STUDENT_STATUS:
                result = {
                    isActiveStudent: request.user.studentStatus,
                };
                break;

            case VerificationAttribute.HOUSING_ELIGIBILITY:
                result = {
                    isHousingEligible: request.user.housingEligible,
                };
                break;

            default:
                throw new AppError(
                    "Unsupported verification attribute.",
                    StatusCodes.BAD_REQUEST
                );
        }

        await prisma.auditLog.create({
            data: {
                actorId: providerId,
                actorType: "SERVICE_PROVIDER",
                providerId,
                userId: request.userId,

                action: "VERIFICATION_RESPONSE_GENERATED",

                description:
                    "Verification response generated using fine-grained attribute filtering",

                metadata: {
                    requestId,
                    requestedAttribute:
                        request.requestedAttribute,
                },
            },
        });

        return {
            requestId: request.id,
            verifiedAttribute:
                request.requestedAttribute,
            result,
        };
    },
};