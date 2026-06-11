import bcrypt from "bcryptjs";

// I hash passwords before saving them so raw passwords never enter the database.
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};