import { Response, Request } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { subredditSchema } from "../validators/subreddit";
import prisma from "../lib/prisma";

export const createSubReddit = async (req: AuthRequest, res: Response) => {
  const parsed = subredditSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });

  const { name } = parsed.data;
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  /*   console.log(slug); */

  try {
    const subreddit = await prisma.subreddit.create({
      data: { name, slug, creatorId: req.userId! },
    });
    res.status(201).json({
      message: "Subreddit created successfully",
      data: subreddit,
    });
  } catch (error) {
    res.status(400).json({ error: "Subreddit already exists or is invalid" });
  }
};

export const getAllSubreddits = async (req: Request, res: Response) => {
  const subreddits = await prisma.subreddit.findMany();
  res.status(200).json({
    data: subreddits,
  });
};
