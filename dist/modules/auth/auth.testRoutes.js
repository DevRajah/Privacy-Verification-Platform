"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authenticate_1 = require("../../middlewares/authenticate");
const authorizeRoles_1 = require("../../middlewares/authorizeRoles");
const router = (0, express_1.Router)();
/**
 * GET /api/auth/test/user-only
 *
 * Only normal users can access this route.
 * This proves providers cannot approve/manage user consent.
 */
router.get("/user-only", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.USER), (req, res) => {
    return res.status(200).json({
        success: true,
        message: "USER-only route accessed successfully",
        data: {
            account: req.user,
        },
    });
});
/**
 * GET /api/auth/test/provider-only
 *
 * Only service providers can access this route.
 * This proves normal users cannot create provider verification workflows.
 */
router.get("/provider-only", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.SERVICE_PROVIDER), (req, res) => {
    return res.status(200).json({
        success: true,
        message: "SERVICE_PROVIDER-only route accessed successfully",
        data: {
            account: req.user,
        },
    });
});
/**
 * GET /api/auth/test/admin-only
 *
 * Only admins can access this route.
 * Later this will protect audit/admin dashboards.
 */
router.get("/admin-only", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.ADMIN), (req, res) => {
    return res.status(200).json({
        success: true,
        message: "ADMIN-only route accessed successfully",
        data: {
            account: req.user,
        },
    });
});
exports.default = router;
