"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const http_status_codes_1 = require("http-status-codes");
/**
 * I use this middleware after authentication.
 *
 * Authentication answers:
 * "Who are you?"
 *
 * Authorization answers:
 * "Are you allowed to do this?"
 *
 * This is important for the MSc project because a normal user should not
 * create verification requests as a service provider, and a provider should
 * not approve consent on behalf of the user.
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Authentication required before authorization.",
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                success: false,
                message: "You do not have permission to access this resource.",
            });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
