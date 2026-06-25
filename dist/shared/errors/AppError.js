"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
// I use this custom error class when I want to throw clean API errors.
// Example: wrong password, email already exists, missing user, etc.
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
