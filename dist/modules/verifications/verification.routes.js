"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authenticate_1 = require("../../middlewares/authenticate");
const authorizeRoles_1 = require("../../middlewares/authorizeRoles");
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const verification_controller_1 = require("./verification.controller");
const router = (0, express_1.Router)();
/**
 * GET /api/verifications/:requestId/result
 *
 * Service provider retrieves the
 * verification result.
 *
 * This endpoint demonstrates
 * fine-grained attribute disclosure.
 */
router.get("/:requestId/result", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.SERVICE_PROVIDER), (0, asyncHandler_1.asyncHandler)(verification_controller_1.verificationController.getVerificationResult));
exports.default = router;
