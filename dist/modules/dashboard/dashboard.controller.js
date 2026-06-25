"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const http_status_codes_1 = require("http-status-codes");
const apiResponse_1 = require("../../shared/utils/apiResponse");
const dashboard_service_1 = require("./dashboard.service");
exports.dashboardController = {
    getUserSummary: async (req, res) => {
        const result = await dashboard_service_1.dashboardService.getUserSummary(req.user.id);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "User dashboard summary fetched successfully", result);
    },
    getProviderSummary: async (req, res) => {
        const result = await dashboard_service_1.dashboardService.getProviderSummary(req.user.id);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Provider dashboard summary fetched successfully", result);
    },
    getAdminSummary: async (_req, res) => {
        const result = await dashboard_service_1.dashboardService.getAdminSummary();
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Admin dashboard summary fetched successfully", result);
    },
};
