import { Router } from "express";
import { UserRole } from "@prisma/client";

import { authenticate } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorizeRoles";
import { asyncHandler } from "../../shared/utils/asyncHandler";

import { verificationController } from "./verification.controller";

/**
 * @swagger
 * /api/verifications/{requestId}/result:
 *   get:
 *     summary: Get fine-grained verification result
 *     tags: [Verifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Minimal disclosure verification result generated successfully
 *       400:
 *         description: Consent is pending, rejected, revoked, or expired
 */

const router = Router();

/**
 * GET /api/verifications/:requestId/result
 *
 * Service provider retrieves the
 * verification result.
 *
 * This endpoint demonstrates
 * fine-grained attribute disclosure.
 */
router.get(
  "/:requestId/result",
  authenticate,
  authorizeRoles(UserRole.SERVICE_PROVIDER),
  asyncHandler(
    verificationController.getVerificationResult
  )
);

export default router;