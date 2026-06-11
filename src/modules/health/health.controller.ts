import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/database";
import { sendSuccess } from "../../shared/utils/apiResponse";

export const healthController = {
  checkHealth: async (_req: Request, res: Response) => {
    // I use a lightweight database query to confirm the database connection works.
    await prisma.$queryRaw`SELECT 1`;

    return sendSuccess(
      res,
      StatusCodes.OK,
      "System health check passed",
      {
        api: "online",
        database: "connected",
        service: "Privacy Verification Platform",
        timestamp: new Date().toISOString(),
      }
    );
  },
};