"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationController = void 0;
const http_status_codes_1 = require("http-status-codes");
const apiResponse_1 = require("../../shared/utils/apiResponse");
const verification_service_1 = require("./verification.service");
const AppError_1 = require("../../shared/errors/AppError");
const getParamAsString = (param, name) => {
    if (!param || Array.isArray(param)) {
        throw new AppError_1.AppError(`Invalid ${name}`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    return param;
};
exports.verificationController = {
    getVerificationResult: async (req, res) => {
        const providerId = req.user.id;
        const requestId = getParamAsString(req.params.requestId, "requestId");
        const result = await verification_service_1.verificationService.getVerificationResult(requestId, providerId);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Verification result generated successfully", result);
    },
};
