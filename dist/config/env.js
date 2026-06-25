"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// I keep all important environment variables in one place.
// This makes the app easier to manage and safer than using process.env everywhere.
exports.env = {
    port: process.env.PORT || "7000",
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || "fallback_secret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    nodeEnv: process.env.NODE_ENV || "development",
};
