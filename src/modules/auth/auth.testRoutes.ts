import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate";
import { authorizeRoles } from "../../middlewares/authorizeRoles";

const router = Router();

/**
 * GET /api/auth/test/user-only
 *
 * Only normal users can access this route.
 * This proves providers cannot approve/manage user consent.
 */
router.get(
  "/user-only",
  authenticate,
  authorizeRoles(UserRole.USER),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "USER-only route accessed successfully",
      data: {
        account: req.user,
      },
    });
  }
);

/**
 * GET /api/auth/test/provider-only
 *
 * Only service providers can access this route.
 * This proves normal users cannot create provider verification workflows.
 */
router.get(
  "/provider-only",
  authenticate,
  authorizeRoles(UserRole.SERVICE_PROVIDER),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "SERVICE_PROVIDER-only route accessed successfully",
      data: {
        account: req.user,
      },
    });
  }
);

/**
 * GET /api/auth/test/admin-only
 *
 * Only admins can access this route.
 * Later this will protect audit/admin dashboards.
 */
router.get(
  "/admin-only",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "ADMIN-only route accessed successfully",
      data: {
        account: req.user,
      },
    });
  }
);

export default router;