"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authenticate_1 = require("../../middlewares/authenticate");
const authorizeRoles_1 = require("../../middlewares/authorizeRoles");
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
/**
 * GET /api/admin/audit-logs
 *
 * I use this endpoint for admin/auditor visibility.
 * It helps demonstrate platform accountability in the dissertation.
 */
router.get("/audit-logs", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.ADMIN), (0, asyncHandler_1.asyncHandler)(admin_controller_1.adminController.getAllAuditLogs));
/**
 * GET /api/admin/verification-requests
 *
 * I use this endpoint so an admin can inspect verification request activity.
 * This supports transparency and monitoring.
 */
router.get("/verification-requests", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.ADMIN), (0, asyncHandler_1.asyncHandler)(admin_controller_1.adminController.getAllVerificationRequests));
/**
 * GET /api/admin/summary
 *
 * I use this endpoint to show high-level platform metrics.
 * This gives useful evidence for Chapter 5 evaluation screenshots.
 */
router.get("/summary", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.ADMIN), (0, asyncHandler_1.asyncHandler)(admin_controller_1.adminController.getPlatformSummary));
exports.default = router;
