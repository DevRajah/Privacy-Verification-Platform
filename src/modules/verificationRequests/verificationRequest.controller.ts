import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { verificationRequestService } from "./verificationRequest.service";

export const verificationRequestController = {
  createVerificationRequest: async (req: Request, res: Response) => {
    const providerId = req.user!.id;

    const result = await verificationRequestService.createVerificationRequest(
      providerId,
      req.body
    );

    return sendSuccess(
      res,
      StatusCodes.CREATED,
      "Verification request created successfully. A pending consent record has been created for the user.",
      result
    );
  },

  getUserRequests: async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const result = await verificationRequestService.getUserRequests(userId);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "User verification requests fetched successfully",
      result
    );
  },

  getProviderRequests: async (req: Request, res: Response) => {
    const providerId = req.user!.id;

    const result = await verificationRequestService.getProviderRequests(
      providerId
    );

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Provider verification requests fetched successfully",
      result
    );
  },

  getRequestById: async (req: Request, res: Response) => {
    const result = await verificationRequestService.getRequestById(
      req.params.requestId,
      req.user!.id,
      req.user!.accountType
    );

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Verification request fetched successfully",
      result
    );
  },
};