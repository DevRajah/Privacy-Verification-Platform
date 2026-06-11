import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/database";
import { AppError } from "../../shared/errors/AppError";
import { hashPassword } from "../../shared/utils/hashPassword";
import { comparePassword } from "../../shared/utils/comparePassword";
import { generateToken } from "../../shared/utils/generateToken";
import {
  LoginInput,
  RegisterProviderInput,
  RegisterUserInput,
} from "./auth.types";

export const authService = {
  registerUser: async (payload: RegisterUserInput) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new AppError("A user with this email already exists", StatusCodes.CONFLICT);
    }

    const hashedPassword = await hashPassword(payload.password);

    const user = await prisma.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        password: hashedPassword,
        studentStatus: payload.studentStatus ?? false,
        housingEligible: payload.housingEligible ?? false,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        studentStatus: true,
        housingEligible: true,
        createdAt: true,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      accountType: "USER",
    });

    return {
      user,
      token,
    };
  },

  registerProvider: async (payload: RegisterProviderInput) => {
    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { email: payload.email },
    });

    if (existingProvider) {
      throw new AppError(
        "A service provider with this email already exists",
        StatusCodes.CONFLICT
      );
    }

    const hashedPassword = await hashPassword(payload.password);

    const provider = await prisma.serviceProvider.create({
      data: {
        organisationName: payload.organisationName,
        email: payload.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        organisationName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = generateToken({
      id: provider.id,
      email: provider.email,
      role: provider.role,
      accountType: "SERVICE_PROVIDER",
    });

    return {
      provider,
      token,
    };
  },

  login: async (payload: LoginInput) => {
    if (payload.accountType === "USER") {
      const user = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
      }

      const passwordMatches = await comparePassword(payload.password, user.password);

      if (!passwordMatches) {
        throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        accountType: "USER",
      });

      return {
        accountType: "USER",
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          studentStatus: user.studentStatus,
          housingEligible: user.housingEligible,
        },
      };
    }

    const provider = await prisma.serviceProvider.findUnique({
      where: { email: payload.email },
    });

    if (!provider) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const passwordMatches = await comparePassword(
      payload.password,
      provider.password
    );

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const token = generateToken({
      id: provider.id,
      email: provider.email,
      role: provider.role,
      accountType: "SERVICE_PROVIDER",
    });

    return {
      accountType: "SERVICE_PROVIDER",
      token,
      provider: {
        id: provider.id,
        organisationName: provider.organisationName,
        email: provider.email,
        role: provider.role,
      },
    };
  },
};