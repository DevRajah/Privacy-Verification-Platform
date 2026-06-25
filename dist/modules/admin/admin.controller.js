"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const apiResponse_1 = require("../../shared/utils/apiResponse");
const admin_service_1 = require("./admin.service");
exports.adminController = {
    getAllAuditLogs: async (_req, res) => {
        const result = await admin_service_1.adminService.getAllAuditLogs();
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "All audit logs fetched successfully", result);
    },
    getAllVerificationRequests: async (_req, res) => {
        const result = await admin_service_1.adminService.getAllVerificationRequests();
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "All verification requests fetched successfully", result);
    },
    getPlatformSummary: async (_req, res) => {
        const result = await admin_service_1.adminService.getPlatformSummary();
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Platform summary fetched successfully", result);
    },
};
