import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorizeRoles";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { auditLogController } from "./auditLog.controller";

/**
 * @swagger
 * /api/audit-logs/user:
 *   get:
 *     summary: Get audit logs for logged-in user
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User audit logs fetched successfully
 */

/**
 * @swagger
 * /api/audit-logs/provider:
 *   get:
 *     summary: Get audit logs for logged-in provider
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Provider audit logs fetched successfully
 */

const router = Router();

/**
 * GET /api/audit-logs/user
 *
 * I use this endpoint so a user can see a history of verification-related actions.
 * This supports transparency because the user can inspect consent and verification events.
 */
router.get(
  "/user",
  authenticate,
  authorizeRoles(UserRole.USER),
  asyncHandler(auditLogController.getUserAuditLogs)
);

/**
 * GET /api/audit-logs/provider
 *
 * I use this endpoint so a service provider can view actions linked to its requests.
 */
router.get(
  "/provider",
  authenticate,
  authorizeRoles(UserRole.SERVICE_PROVIDER),
  asyncHandler(auditLogController.getProviderAuditLogs)
);

export default router;