import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { verificationService } from "./verification.service";

export const verificationController = {
  getVerificationResult: async (
    req: Request,
    res: Response
  ) => {
    const providerId = req.user!.id;

    const result =
      await verificationService.getVerificationResult(
        req.params.requestId,
        providerId 
      );

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Verification result generated successfully",
      result
    );
  },
};