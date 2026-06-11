import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { adminService } from "./admin.service";

export const adminController = {
  getAllAuditLogs: async (_req: Request, res: Response) => {
    const result = await adminService.getAllAuditLogs();

    return sendSuccess(
      res,
      StatusCodes.OK,
      "All audit logs fetched successfully",
      result
    );
  },

  getAllVerificationRequests: async (_req: Request, res: Response) => {
    const result = await adminService.getAllVerificationRequests();

    return sendSuccess(
      res,
      StatusCodes.OK,
      "All verification requests fetched successfully",
      result
    );
  },

  getPlatformSummary: async (_req: Request, res: Response) => {
    const result = await adminService.getPlatformSummary();

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Platform summary fetched successfully",
      result
    );
  },
};