"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../shared/errors/AppError");
// I use one global error handler instead of repeating try/catch response logic everywhere.
const errorHandler = (error, _req, res, _next) => {
    console.error("API Error:", error);
    if (error instanceof AppError_1.AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
    // I catch known Prisma errors so database details do not leak to API users.
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
            return res.status(400).json({
                success: false,
                message: "The requested operation references a record that no longer exists.",
            });
        }
        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Requested resource was not found.",
            });
        }
    }
    return res.status(500).json({
        success: false,
        message: "Something went wrong on the server",
    });
};
exports.errorHandler = errorHandler;
