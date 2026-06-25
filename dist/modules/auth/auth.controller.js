"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const http_status_codes_1 = require("http-status-codes");
const apiResponse_1 = require("../../shared/utils/apiResponse");
const auth_service_1 = require("./auth.service");
exports.authController = {
    registerUser: async (req, res) => {
        const result = await auth_service_1.authService.registerUser(req.body);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.CREATED, "User registered successfully", result);
    },
    registerProvider: async (req, res) => {
        const result = await auth_service_1.authService.registerProvider(req.body);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.CREATED, "Service provider registered successfully", result);
    },
    login: async (req, res) => {
        const result = await auth_service_1.authService.login(req.body);
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Login successful", result);
    },
    getMe: async (req, res) => {
        return (0, apiResponse_1.sendSuccess)(res, http_status_codes_1.StatusCodes.OK, "Logged-in account fetched successfully", {
            account: req.user,
        });
    },
};
