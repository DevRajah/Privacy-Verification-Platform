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

/**
 * @swagger
 * /api/auth/register-user:
 *   post:
 *     summary: Register a public-service user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Michael Adekunle
 *               email:
 *                 type: string
 *                 example: michael@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               studentStatus:
 *                 type: boolean
 *                 example: true
 *               housingEligible:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /api/auth/register-provider:
 *   post:
 *     summary: Register a service provider
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organisationName
 *               - email
 *               - password
 *             properties:
 *               organisationName:
 *                 type: string
 *                 example: Manchester Housing Service
 *               email:
 *                 type: string
 *                 example: housing@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Service provider registered successfully
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login as user or service provider
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - accountType
 *             properties:
 *               email:
 *                 type: string
 *                 example: michael@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               accountType:
 *                 type: string
 *                 enum: [USER, SERVICE_PROVIDER]
 *                 example: USER
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged-in account fetched successfully
 */

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