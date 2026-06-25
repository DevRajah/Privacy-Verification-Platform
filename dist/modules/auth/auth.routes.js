"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const validateRequest_1 = require("../../middlewares/validateRequest");
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const authenticate_1 = require("../../middlewares/authenticate");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/register-user
 *
 * I use this endpoint when a normal public-service user wants to create an account.
 */
router.post("/register-user", (0, validateRequest_1.validateRequest)(auth_validation_1.registerUserSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.registerUser));
/**
 * POST /api/auth/register-provider
 *
 * I use this endpoint when a service provider wants to create an organisation account.
 */
router.post("/register-provider", (0, validateRequest_1.validateRequest)(auth_validation_1.registerProviderSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.registerProvider));
/**
 * POST /api/auth/login
 *
 * I use this endpoint for both users and service providers.
 */
router.post("/login", (0, validateRequest_1.validateRequest)(auth_validation_1.loginSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.login));
/**
 * GET /api/auth/me
 *
 * I use this endpoint to test if JWT authentication is working.
 * The request must include:
 *
 * Authorization: Bearer <token>
 */
router.get("/me", authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.getMe));
exports.default = router;
