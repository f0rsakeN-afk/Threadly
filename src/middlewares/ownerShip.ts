import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "./authMiddleware";

export const isSubredditCreator = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  /*   console.log(id) */
  const subreddit = await prisma.subreddit.findUnique({ where: { id } });

  if (!subreddit || subreddit.creatorId !== req.userId)
    return res.status(403).json({
      error: "Not allowed to manage this subreddit",
    });

  next();
};

export const isPostOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post || post.authorId !== req.userId)
    return res.status(403).json({
      error: "Not allowed to manage this post",
    });

  next();
};

export const isCommentOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment || !(comment.authorId !== req.userId))
    return res.status(403).json({
      error: "Not allowed to manage this comment",
    });

  next();
};
