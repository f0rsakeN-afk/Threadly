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

export const updateSubreddit = async (req: AuthRequest, res: Response) => {
  const parsed = subredditSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.format() });

  const { name } = parsed.data;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  try {
    const subreddit = await prisma.subreddit.update({
      where: { id: req.params.id },
      data: { name, slug },
    });
    res.status(200).json({
      status: "success",
      data: subreddit,
    });
  } catch (error) {
    res.status(400).json({ error: "Could not update subreddit" });
  }
};

export const deleteSubreddit = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.subreddit.delete({ where: { id: req.params.id } });
    res.status(200).json({
      message: "Subreddit along with its post deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ error: "Subreddit deletion failed" });
  }
};

export const getAllSubreddits = async (req: Request, res: Response) => {
  const subreddits = await prisma.subreddit.findMany();
  res.status(200).json({
    results: subreddits.length,
    data: subreddits,
  });
};
