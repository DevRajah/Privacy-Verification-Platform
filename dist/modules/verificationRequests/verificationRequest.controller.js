"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationRequestController = void 0;
const http_status_codes_1 = require("http-status-codes");
const apiResponse_1 = require("../../shared/utils/apiResponse");
const verificationRequest_service_1 = require("./verificationRequest.service");
const AppError_1 = require("../../shared/errors/AppError");
const getParamAsString = (param, name) => {
    if (!param || Array.isArray(param)) {
        throw new AppError_1.AppError(`Invalid ${name}`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    return param;
};
exports.verificationRequestController = {
    createVerificationRequest: async (req, res) => {
        const providerId = req.user.id;
        const result = await verificationRequest_service_1.verificationRequestService.createVerificationRequest(providerId, req.body);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.CREATED, "Verification request created successfully. A pending consent record has been created for the user.", result);
    },
    getUserRequests: async (req, res) => {
        const userId = req.user.id;
        const result = await verificationRequest_service_1.verificationRequestService.getUserRequests(userId);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "User verification requests fetched successfully", result);
    },
    getProviderRequests: async (req, res) => {
        const providerId = req.user.id;
        const result = await verificationRequest_service_1.verificationRequestService.getProviderRequests(providerId);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Provider verification requests fetched successfully", result);
    },
    getRequestById: async (req, res) => {
        const result = await verificationRequest_service_1.verificationRequestService.getRequestById(getParamAsString(req.params.requestId, "requestId"), req.user.id, req.user.accountType);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Verification request fetched successfully", result);
    },
};
