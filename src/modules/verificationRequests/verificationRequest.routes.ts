import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorizeRoles";
import { validateRequest } from "../../middlewares/validateRequest";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { createVerificationRequestSchema } from "./verificationRequest.validation";
import { verificationRequestController } from "./verificationRequest.controller";


/**
 * @swagger
 * /api/verification-requests:
 *   post:
 *     summary: Create a scoped verification request
 *     tags: [Verification Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userEmail
 *               - requestedAttribute
 *               - purpose
 *             properties:
 *               userEmail:
 *                 type: string
 *                 example: michael@example.com
 *               requestedAttribute:
 *                 type: string
 *                 enum: [STUDENT_STATUS, HOUSING_ELIGIBILITY]
 *                 example: STUDENT_STATUS
 *               purpose:
 *                 type: string
 *                 example: To confirm student eligibility for public-service access
 *     responses:
 *       201:
 *         description: Verification request created successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Service provider role required
 */

/**
 * @swagger
 * /api/verification-requests/user:
 *   get:
 *     summary: Get verification requests for logged-in user
 *     tags: [Verification Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User verification requests fetched successfully
 */

/**
 * @swagger
 * /api/verification-requests/provider:
 *   get:
 *     summary: Get verification requests created by logged-in provider
 *     tags: [Verification Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Provider verification requests fetched successfully
 */

/**
 * @swagger
 * /api/verification-requests/{requestId}:
 *   get:
 *     summary: Get one verification request by ID
 *     tags: [Verification Requests]
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
 *         description: Verification request fetched successfully
 */

const router = Router();

/**
 * POST /api/verification-requests
 *
 * Service provider creates a verification request for one specific user attribute.
 *
 * Example:
 * "I need to verify if this user is a student."
 *
 * This directly supports privacy-preserving verification because the provider
 * requests a scoped attribute instead of asking for full identity documents.
 */
router.post(
  "/",
  authenticate,
  authorizeRoles(UserRole.SERVICE_PROVIDER),
  validateRequest(createVerificationRequestSchema),
  asyncHandler(verificationRequestController.createVerificationRequest)
);

/**
 * GET /api/verification-requests/user
 *
 * Normal users use this endpoint to see verification requests made about them.
 *
 * This supports transparency because users can see who asked for what and why.
 */
router.get(
  "/user",
  authenticate,
  authorizeRoles(UserRole.USER),
  asyncHandler(verificationRequestController.getUserRequests)
);

/**
 * GET /api/verification-requests/provider
 *
 * Service providers use this endpoint to view requests they created.
 *
 * This supports public-service integration because providers can track request status.
 */
router.get(
  "/provider",
  authenticate,
  authorizeRoles(UserRole.SERVICE_PROVIDER),
  asyncHandler(verificationRequestController.getProviderRequests)
);

/**
 * GET /api/verification-requests/:requestId
 *
 * Users and providers can view one request only if it belongs to them.
 */
router.get(
  "/:requestId",
  authenticate,
  authorizeRoles(UserRole.USER, UserRole.SERVICE_PROVIDER),
  asyncHandler(verificationRequestController.getRequestById)
);

export default router;