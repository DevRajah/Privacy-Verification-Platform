"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authenticate_1 = require("../../middlewares/authenticate");
const authorizeRoles_1 = require("../../middlewares/authorizeRoles");
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const consent_controller_1 = require("./consent.controller");
const router = (0, express_1.Router)();
/**
 * GET /api/consents/my-consents
 *
 * I use this endpoint so a normal user can see all consent records linked to them.
 *
 * Dissertation link:
 * This supports verification transparency because the user can see consent history,
 * pending requests, approvals, rejections, and revocations.
 */
router.get("/my-consents", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.USER), (0, asyncHandler_1.asyncHandler)(consent_controller_1.consentController.getMyConsents));
/**
 * PATCH /api/consents/:consentId/approve
 *
 * I use this endpoint when the user agrees to share the requested attribute.
 *
 * Important:
 * The system still does not expose full identity documents.
 * It only allows the requested attribute to be verified later.
 */
router.patch("/:consentId/approve", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.USER), (0, asyncHandler_1.asyncHandler)(consent_controller_1.consentController.approveConsent));
/**
 * PATCH /api/consents/:consentId/reject
 *
 * I use this endpoint when the user refuses the verification request.
 *
 * Dissertation link:
 * This proves the user has control before disclosure happens.
 */
router.patch("/:consentId/reject", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.USER), (0, asyncHandler_1.asyncHandler)(consent_controller_1.consentController.rejectConsent));
/**
 * PATCH /api/consents/:consentId/revoke
 *
 * I use this endpoint when the user withdraws previously approved consent.
 *
 * Dissertation link:
 * This directly addresses the limited consent lifecycle management gap.
 */
router.patch("/:consentId/revoke", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(client_1.UserRole.USER), (0, asyncHandler_1.asyncHandler)(consent_controller_1.consentController.revokeConsent));
exports.default = router;
