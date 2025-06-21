import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import prisma from "../lib/prisma";
import { updatePasswordSchema } from "../validators/auth";
import { comparePassword, hashPassword } from "../utils/hash";

export const updatePassword = async (req: AuthRequest, res: Response) => {
  const parsed = updatePasswordSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findFirst({ where: { userId: req.userId } });
  if (!user) return res.status(404).json({ error: "user not found" });

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) res.status(400).json({ error: "Current password is wrong" });

  const newHashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { userId: user.userId },
    data: {
      password: newHashed,
    },
  });
  res.status(200).json({
    message: "Password updated successfully",
  });
};
