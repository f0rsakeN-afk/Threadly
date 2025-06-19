import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

if (!jwtSecret || !jwtExpiresIn) {
  throw new Error("JWT_SECRET or JWT_EXPIRES_IN is not defined in environment variables.");
}

const JWT_SECRET = jwtSecret as string;
const JWT_EXPIRES_IN = jwtExpiresIn as string;

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}
