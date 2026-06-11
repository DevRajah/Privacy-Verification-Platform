import { Router } from "express";
import { authController } from "./auth.controller";
import {
  loginSchema,
  registerProviderSchema,
  registerUserSchema,
} from "./auth.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

/**
 * POST /api/auth/register-user
 *
 * I use this endpoint when a normal public-service user wants to create an account.
 */
router.post(
  "/register-user",
  validateRequest(registerUserSchema),
  asyncHandler(authController.registerUser)
);

/**
 * POST /api/auth/register-provider
 *
 * I use this endpoint when a service provider wants to create an organisation account.
 */
router.post(
  "/register-provider",
  validateRequest(registerProviderSchema),
  asyncHandler(authController.registerProvider)
);

/**
 * POST /api/auth/login
 *
 * I use this endpoint for both users and service providers.
 */
router.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(authController.login)
);

/**
 * GET /api/auth/me
 *
 * I use this endpoint to test if JWT authentication is working.
 * The request must include:
 *
 * Authorization: Bearer <token>
 */
router.get("/me", authenticate, asyncHandler(authController.getMe));

export default router;