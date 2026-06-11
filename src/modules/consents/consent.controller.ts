import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../../shared/utils/apiResponse";
import { consentService } from "./consent.service";

export const consentController = {
  getMyConsents: async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const result = await consentService.getMyConsents(userId);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "User consent records fetched successfully",
      result
    );
  },

  approveConsent: async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { consentId } = req.params;

    const result = await consentService.approveConsent(consentId, userId);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Consent approved successfully",
      result
    );
  },

  rejectConsent: async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { consentId } = req.params;

    const result = await consentService.rejectConsent(consentId, userId);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Consent rejected successfully",
      result
    );
  },

  revokeConsent: async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { consentId } = req.params;

    const result = await consentService.revokeConsent(consentId, userId);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Consent revoked successfully",
      result
    );
  },
};