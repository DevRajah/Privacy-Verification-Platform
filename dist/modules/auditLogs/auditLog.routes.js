"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authenticate_1 = require("../../middlewares/authenticate");
const authorizeRoles_1 = require("../../middlewares/authorizeRoles");
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const auditLog_controller_1 = require("./auditLog.controller");
const router = (0, express_1.Router)();
/**
 * GET /api/audit-logs/user
 *
 * I use this endpoint so a user can see a history of verification-related actions.
 * This supports transparency because the user can inspect consent and verification events.
 */
router.get("/user", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.USER), (0, asyncHandler_1.asyncHandler)(auditLog_controller_1.auditLogController.getUserAuditLogs));
/**
 * GET /api/audit-logs/provider
 *
 * I use this endpoint so a service provider can view actions linked to its requests.
 */
router.get("/provider", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.SERVICE_PROVIDER), (0, asyncHandler_1.asyncHandler)(auditLog_controller_1.auditLogController.getProviderAuditLogs));
exports.default = router;
