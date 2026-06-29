import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorizeRoles";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { adminController } from "./admin.controller";

/**
 * @swagger
 * /api/admin/summary:
 *   get:
 *     summary: Get platform admin summary
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform summary fetched successfully
 */

/**
 * @swagger
 * /api/admin/audit-logs:
 *   get:
 *     summary: Get all audit logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All audit logs fetched successfully
 */

/**
 * @swagger
 * /api/admin/verification-requests:
 *   get:
 *     summary: Get all verification requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All verification requests fetched successfully
 */

const router = Router();

/**
 * GET /api/admin/audit-logs
 *
 * I use this endpoint for admin/auditor visibility.
 * It helps demonstrate platform accountability in the dissertation.
 */
router.get(
  "/audit-logs",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(adminController.getAllAuditLogs)
);

/**
 * GET /api/admin/verification-requests
 *
 * I use this endpoint so an admin can inspect verification request activity.
 * This supports transparency and monitoring.
 */
router.get(
  "/verification-requests",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(adminController.getAllVerificationRequests)
);

/**
 * GET /api/admin/summary
 *
 * I use this endpoint to show high-level platform metrics.
 * This gives useful evidence for Chapter 5 evaluation screenshots.
 */
router.get(
  "/summary",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(adminController.getPlatformSummary)
);

export default router;