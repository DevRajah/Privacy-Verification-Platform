import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { verificationService } from "./verification.service";
import { AppError } from "../../shared/errors/AppError";

const getParamAsString = (param: string | string[] | undefined, name: string) => {
  if (!param || Array.isArray(param)) {
    throw new AppError(`Invalid ${name}`, StatusCodes.BAD_REQUEST);
  }

  return param;
};

export const verificationController = {
  getVerificationResult: async (req: Request, res: Response) => {
    const providerId = req.user!.id;
    const requestId = getParamAsString(req.params.requestId, "requestId");

    const result = await verificationService.getVerificationResult(
      requestId,
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