import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { dashboardService } from "./dashboard.service";

export const dashboardController = {
  getUserSummary: async (req: Request, res: Response) => {
    const result = await dashboardService.getUserSummary(req.user!.id);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "User dashboard summary fetched successfully",
      result
    );
  },

  getProviderSummary: async (req: Request, res: Response) => {
    const result = await dashboardService.getProviderSummary(req.user!.id);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Provider dashboard summary fetched successfully",
      result
    );
  },

  getAdminSummary: async (_req: Request, res: Response) => {
    const result = await dashboardService.getAdminSummary();

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Admin dashboard summary fetched successfully",
      result
    );
  },
};