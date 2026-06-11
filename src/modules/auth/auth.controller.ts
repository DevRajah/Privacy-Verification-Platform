import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { authService } from "./auth.service";

export const authController = {
  registerUser: async (req: Request, res: Response) => {
    const result = await authService.registerUser(req.body);

    return sendSuccess(
      res,
      StatusCodes.CREATED,
      "User registered successfully",
      result
    );
  },

  registerProvider: async (req: Request, res: Response) => {
    const result = await authService.registerProvider(req.body);

    return sendSuccess(
      res,
      StatusCodes.CREATED,
      "Service provider registered successfully",
      result
    );
  },

  login: async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    return sendSuccess(res, StatusCodes.OK, "Login successful", result);
  },

    getMe: async (req: Request, res: Response) => {
    return sendSuccess(res, StatusCodes.OK, "Logged-in account fetched successfully", {
      account: req.user,
    });
  },
};