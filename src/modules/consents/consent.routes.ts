import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorizeRoles";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { consentController } from "./consent.controller";

/**
 * @swagger
 * /api/consents/my-consents:
 *   get:
 *     summary: Get logged-in user's consent records
 *     tags: [Consents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User consent records fetched successfully
 */

/**
 * @swagger
 * /api/consents/{consentId}/approve:
 *   patch:
 *     summary: Approve pending consent
 *     tags: [Consents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consent approved successfully
 */

/**
 * @swagger
 * /api/consents/{consentId}/reject:
 *   patch:
 *     summary: Reject pending consent
 *     tags: [Consents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consent rejected successfully
 */

/**
 * @swagger
 * /api/consents/{consentId}/revoke:
 *   patch:
 *     summary: Revoke approved consent
 *     tags: [Consents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consent revoked successfully
 */

const router = Router();

/**
 * GET /api/consents/my-consents
 *
 * I use this endpoint so a normal user can see all consent records linked to them.
 *
 * Dissertation link:
 * This supports verification transparency because the user can see consent history,
 * pending requests, approvals, rejections, and revocations.
 */
router.get(
  "/my-consents",
  authenticate,
  authorizeRoles(UserRole.USER),
  asyncHandler(consentController.getMyConsents)
);

/**
 * PATCH /api/consents/:consentId/approve
 *
 * I use this endpoint when the user agrees to share the requested attribute.
 *
 * Important:
 * The system still does not expose full identity documents.
 * It only allows the requested attribute to be verified later.
 */
router.patch(
  "/:consentId/approve",
  authenticate,
  authorizeRoles(UserRole.USER),
  asyncHandler(consentController.approveConsent)
);

/**
 * PATCH /api/consents/:consentId/reject
 *
 * I use this endpoint when the user refuses the verification request.
 *
 * Dissertation link:
 * This proves the user has control before disclosure happens.
 */
router.patch(
  "/:consentId/reject",
  authenticate,
  authorizeRoles(UserRole.USER),
  asyncHandler(consentController.rejectConsent)
);

/**
 * PATCH /api/consents/:consentId/revoke
 *
 * I use this endpoint when the user withdraws previously approved consent.
 *
 * Dissertation link:
 * This directly addresses the limited consent lifecycle management gap.
 */
router.patch(
  "/:consentId/revoke",
  authenticate,
  authorizeRoles(UserRole.USER),
  asyncHandler(consentController.revokeConsent)
);

export default router;