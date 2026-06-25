"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authenticate_1 = require("../../middlewares/authenticate");
const authorizeRoles_1 = require("../../middlewares/authorizeRoles");
const validateRequest_1 = require("../../middlewares/validateRequest");
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const verificationRequest_validation_1 = require("./verificationRequest.validation");
const verificationRequest_controller_1 = require("./verificationRequest.controller");
const router = (0, express_1.Router)();
/**
 * POST /api/verification-requests
 *
 * Service provider creates a verification request for one specific user attribute.
 *
 * Example:
 * "I need to verify if this user is a student."
 *
 * This directly supports privacy-preserving verification because the provider
 * requests a scoped attribute instead of asking for full identity documents.
 */
router.post("/", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.SERVICE_PROVIDER), (0, validateRequest_1.validateRequest)(verificationRequest_validation_1.createVerificationRequestSchema), (0, asyncHandler_1.asyncHandler)(verificationRequest_controller_1.verificationRequestController.createVerificationRequest));
/**
 * GET /api/verification-requests/user
 *
 * Normal users use this endpoint to see verification requests made about them.
 *
 * This supports transparency because users can see who asked for what and why.
 */
router.get("/user", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.USER), (0, asyncHandler_1.asyncHandler)(verificationRequest_controller_1.verificationRequestController.getUserRequests));
/**
 * GET /api/verification-requests/provider
 *
 * Service providers use this endpoint to view requests they created.
 *
 * This supports public-service integration because providers can track request status.
 */
router.get("/provider", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.SERVICE_PROVIDER), (0, asyncHandler_1.asyncHandler)(verificationRequest_controller_1.verificationRequestController.getProviderRequests));
/**
 * GET /api/verification-requests/:requestId
 *
 * Users and providers can view one request only if it belongs to them.
 */
router.get("/:requestId", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.USER, client_1.UserRole.SERVICE_PROVIDER), (0, asyncHandler_1.asyncHandler)(verificationRequest_controller_1.verificationRequestController.getRequestById));
exports.default = router;
