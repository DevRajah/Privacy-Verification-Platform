"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authenticate_1 = require("../../middlewares/authenticate");
const authorizeRoles_1 = require("../../middlewares/authorizeRoles");
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const dashboard_controller_1 = require("./dashboard.controller");
const router = (0, express_1.Router)();
/**
 * GET /api/dashboard/user-summary
 *
 * I use this endpoint to move user dashboard calculations into the backend.
 * The user only receives their own verification and audit data.
 */
router.get("/user-summary", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.USER), (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.dashboardController.getUserSummary));
/**
 * GET /api/dashboard/provider-summary
 *
 * I use this endpoint to move provider dashboard calculations into the backend.
 * The provider only receives data linked to their own service provider account.
 */
router.get("/provider-summary", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.SERVICE_PROVIDER), (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.dashboardController.getProviderSummary));
/**
 * GET /api/dashboard/admin-summary
 *
 * I use this endpoint to give admins platform-wide summary data.
 */
router.get("/admin-summary", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.ADMIN), (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.dashboardController.getAdminSummary));
exports.default = router;
