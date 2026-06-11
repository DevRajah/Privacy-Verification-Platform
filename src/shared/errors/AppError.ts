// I use this custom error class when I want to throw clean API errors.
// Example: wrong password, email already exists, missing user, etc.
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}