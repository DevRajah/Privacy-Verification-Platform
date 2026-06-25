"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const health_controller_1 = require("./health.controller");
const router = (0, express_1.Router)();
/**
 * GET /api/health
 *
 * I use this endpoint to confirm that the API and database are working.
 * This helps with testing, deployment checks, and dissertation evaluation evidence.
 */
router.get("/", (0, asyncHandler_1.asyncHandler)(health_controller_1.healthController.checkHealth));
exports.default = router;
