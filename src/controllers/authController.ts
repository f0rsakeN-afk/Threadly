import { hashPassword, comparePassword } from "../utils/hash";
import { loginSchema, registerSchema } from "../validators/auth";
import { generateToken, verifyToken } from "../utils/jwt";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.flatten().fieldErrors });
    }

    const { email, password, username } = parsed.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, username },
    });

    const token = generateToken(user.userId);
    res.status(201).json({
      token,
      user: { id: user.userId, email, username },
    });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ error: parsed.error.flatten().fieldErrors });

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await comparePassword(password, user.password)))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user.userId);
    res.status(200).json({
      token,
      user: { id: user.userId, email, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
