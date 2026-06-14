import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorizeRoles";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { dashboardController } from "./dashboard.controller";

const router = Router();

/**
 * GET /api/dashboard/user-summary
 *
 * I use this endpoint to move user dashboard calculations into the backend.
 * The user only receives their own verification and audit data.
 */
router.get(
  "/user-summary",
  authenticate,
  authorizeRoles(UserRole.USER),
  asyncHandler(dashboardController.getUserSummary)
);

/**
 * GET /api/dashboard/provider-summary
 *
 * I use this endpoint to move provider dashboard calculations into the backend.
 * The provider only receives data linked to their own service provider account.
 */
router.get(
  "/provider-summary",
  authenticate,
  authorizeRoles(UserRole.SERVICE_PROVIDER),
  asyncHandler(dashboardController.getProviderSummary)
);

/**
 * GET /api/dashboard/admin-summary
 *
 * I use this endpoint to give admins platform-wide summary data.
 */
router.get(
  "/admin-summary",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(dashboardController.getAdminSummary)
);

export default router;