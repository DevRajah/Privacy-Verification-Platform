import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "@prisma/client";

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
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required before authorization.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};