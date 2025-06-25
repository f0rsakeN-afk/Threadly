import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import prisma from "../lib/prisma";
import { voteSchema } from "../validators/vote";

export const voteOnPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const parsed = voteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const { postId, value } = parsed.data;
  const numericValue = parseInt(value); // 1 or -1

  try {
    const existing = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: req.userId!,
          postId,
        },
      },
    });

    if (!existing) {
      // New vote
      await prisma.vote.create({
        data: {
          userId: req.userId!,
          postId,
          value: numericValue,
        },
      });
      res.status(201).json({ message: "Vote added" });
      return;
    }

    if (existing.value === numericValue) {
      // Same vote => toggle off (remove vote)
      await prisma.vote.delete({
        where: {
          userId_postId: {
            userId: req.userId!,
            postId,
          },
        },
      });
      res.status(200).json({ message: "Vote removed" });
      return;
    }

    // Different vote => update
    await prisma.vote.update({
      where: {
        userId_postId: {
          userId: req.userId!,
          postId,
        },
      },
      data: {
        value: numericValue,
      },
    });

    res.status(200).json({ message: "Vote updated" });
    return;
  } catch {
    res.status(500).json({ error: "Vote failed" });
    return;
  }
};
