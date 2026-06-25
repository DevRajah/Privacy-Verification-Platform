"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const env_1 = require("../config/env");
const database_1 = require("../config/database");
/**
 * I use this middleware to protect private routes.
 *
 * It checks the Bearer token, verifies the JWT, confirms the account still
 * exists in the database, then attaches the logged-in account to req.user.
 */
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Authentication required. Please provide a valid Bearer token.",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        if (decoded.accountType === "USER") {
            const user = await database_1.prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Authentication session is no longer valid. Please login again.",
                });
            }
        }
        if (decoded.accountType === "SERVICE_PROVIDER") {
            const provider = await database_1.prisma.serviceProvider.findUnique({
                where: { id: decoded.id },
            });
            if (!provider) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Authentication session is no longer valid. Please login again.",
                });
            }
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            accountType: decoded.accountType,
        };
        next();
    }
    catch {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Invalid or expired token. Please login again.",
        });
    }
};
exports.authenticate = authenticate;
