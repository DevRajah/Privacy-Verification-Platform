"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogController = void 0;
const http_status_codes_1 = require("http-status-codes");
const apiResponse_1 = require("../../shared/utils/apiResponse");
const auditLog_service_1 = require("./auditLog.service");
exports.auditLogController = {
    getUserAuditLogs: async (req, res) => {
        const userId = req.user.id;
        const result = await auditLog_service_1.auditLogService.getUserAuditLogs(userId);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "User audit logs fetched successfully", result);
    },
    getProviderAuditLogs: async (req, res) => {
        const providerId = req.user.id;
        const result = await auditLog_service_1.auditLogService.getProviderAuditLogs(providerId);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Provider audit logs fetched successfully", result);
    },
};
