import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorizeRoles";
import { validateRequest } from "../../middlewares/validateRequest";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { createVerificationRequestSchema } from "./verificationRequest.validation";
import { verificationRequestController } from "./verificationRequest.controller";

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