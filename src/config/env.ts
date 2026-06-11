import dotenv from "dotenv";

dotenv.config();

// I keep all important environment variables in one place.
// This makes the app easier to manage and safer than using process.env everywhere.
export const env = {
  port: process.env.PORT || "7000",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "fallback_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  nodeEnv: process.env.NODE_ENV || "development",
};