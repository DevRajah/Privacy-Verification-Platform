"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consentController = void 0;
const http_status_codes_1 = require("http-status-codes");
const apiResponse_1 = require("../../shared/utils/apiResponse");
const consent_service_1 = require("./consent.service");
const AppError_1 = require("../../shared/errors/AppError");
const getParamAsString = (param, name) => {
    if (!param || Array.isArray(param)) {
        throw new AppError_1.AppError(`Invalid ${name}`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    return param;
};
exports.consentController = {
    getMyConsents: async (req, res) => {
        const userId = req.user.id;
        const result = await consent_service_1.consentService.getMyConsents(userId);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "User consent records fetched successfully", result);
    },
    approveConsent: async (req, res) => {
        const userId = req.user.id;
        const consentId = getParamAsString(req.params.consentId, "consentId");
        const result = await consent_service_1.consentService.approveConsent(consentId, userId);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Consent approved successfully", result);
    },
    rejectConsent: async (req, res) => {
        const userId = req.user.id;
        const consentId = getParamAsString(req.params.consentId, "consentId");
        const result = await consent_service_1.consentService.rejectConsent(consentId, userId);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Consent rejected successfully", result);
    },
    revokeConsent: async (req, res) => {
        const userId = req.user.id;
        const consentId = getParamAsString(req.params.consentId, "consentId");
        const result = await consent_service_1.consentService.revokeConsent(consentId, userId);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Consent revoked successfully", result);
    },
};
