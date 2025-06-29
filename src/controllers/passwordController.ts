import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../lib/prisma";
import { hashPassword } from "../utils/hash";
import { forgotPasswordSchema, resetPasswordSchema } from "../validators/auth";
import { sendResetEmail } from "../utils/sendEmail";



export const forgotPassword = async (req: Request, res: Response) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });

  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ error: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: { passwordResetToken: hashed, passwordResetTokenExpiry: expiry },
  });

  sendResetEmail(email, resetToken);
  res.status(200).json({
    message: "Reset link sent",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const parsed = resetPasswordSchema.safeParse(req.body);

  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });

  const { token, newPassword } = parsed.data;

  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashed,
      passwordResetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user)
    return res.status(400).json({
      error: "Token is invalid or has expired",
    });

  const newHashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { userId: user.userId },
    data: {
      password: newHashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiry: null,
    },
  });
  res.status(200).json({ message: "Password reset successfull" });
};
