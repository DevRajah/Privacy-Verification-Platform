import { Router } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { healthController } from "./health.controller";


/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API and database health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System health check passed
 */

const router = Router();

/**
 * GET /api/health
 *
 * I use this endpoint to confirm that the API and database are working.
 * This helps with testing, deployment checks, and dissertation evaluation evidence.
 */
router.get("/", asyncHandler(healthController.checkHealth));

export default router;