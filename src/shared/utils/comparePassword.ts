import bcrypt from "bcryptjs";

// I compare the plain password from login with the hashed password in the database.
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};