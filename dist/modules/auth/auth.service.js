"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const http_status_codes_1 = require("http-status-codes");
const database_1 = require("../../config/database");
const AppError_1 = require("../../shared/errors/AppError");
const hashPassword_1 = require("../../shared/utils/hashPassword");
const comparePassword_1 = require("../../shared/utils/comparePassword");
const generateToken_1 = require("../../shared/utils/generateToken");
exports.authService = {
    registerUser: async (payload) => {
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email: payload.email },
        });
        if (existingUser) {
            throw new AppError_1.AppError("A user with this email already exists", http_status_codes_1.StatusCodes.CONFLICT);
        }
        const hashedPassword = await (0, hashPassword_1.hashPassword)(payload.password);
        const user = await database_1.prisma.user.create({
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
        const token = (0, generateToken_1.generateToken)({
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
    registerProvider: async (payload) => {
        const existingProvider = await database_1.prisma.serviceProvider.findUnique({
            where: { email: payload.email },
        });
        if (existingProvider) {
            throw new AppError_1.AppError("A service provider with this email already exists", http_status_codes_1.StatusCodes.CONFLICT);
        }
        const hashedPassword = await (0, hashPassword_1.hashPassword)(payload.password);
        const provider = await database_1.prisma.serviceProvider.create({
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
        const token = (0, generateToken_1.generateToken)({
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
    login: async (payload) => {
        if (payload.accountType === "USER") {
            const user = await database_1.prisma.user.findUnique({
                where: { email: payload.email },
            });
            if (!user) {
                throw new AppError_1.AppError("Invalid email or password", http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            const passwordMatches = await (0, comparePassword_1.comparePassword)(payload.password, user.password);
            if (!passwordMatches) {
                throw new AppError_1.AppError("Invalid email or password", http_status_codes_1.StatusCodes.UNAUTHORIZED);
            }
            const token = (0, generateToken_1.generateToken)({
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
        const provider = await database_1.prisma.serviceProvider.findUnique({
            where: { email: payload.email },
        });
        if (!provider) {
            throw new AppError_1.AppError("Invalid email or password", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        const passwordMatches = await (0, comparePassword_1.comparePassword)(payload.password, provider.password);
        if (!passwordMatches) {
            throw new AppError_1.AppError("Invalid email or password", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        const token = (0, generateToken_1.generateToken)({
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
