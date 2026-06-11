import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { auditLogService } from "./auditLog.service";

export const auditLogController = {
  getUserAuditLogs: async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const result = await auditLogService.getUserAuditLogs(userId);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "User audit logs fetched successfully",
      result
    );
  },

  getProviderAuditLogs: async (req: Request, res: Response) => {
    const providerId = req.user!.id;

    const result = await auditLogService.getProviderAuditLogs(providerId);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Provider audit logs fetched successfully",
      result
    );
  },
};