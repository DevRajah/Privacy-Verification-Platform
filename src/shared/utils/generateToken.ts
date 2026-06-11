import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";

type TokenPayload = {
  id: string;
  email: string;
  role: string;
  accountType: "USER" | "SERVICE_PROVIDER";
};

// I generate a JWT after login/register so the frontend can authenticate future requests.
export const generateToken = (payload: TokenPayload): string => {
  const secret: Secret = env.jwtSecret;

  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};