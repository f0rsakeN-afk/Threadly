import { AuthRequest } from "../middlewares/authMiddleware";
import { commentSchema, updateCommentSchema } from "../validators/comment";
import { Response, Request } from "express";
import prisma from "../lib/prisma";

export const createComment = async (req: AuthRequest, res: Response) => {
  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.format() });

  const { content, postId, parentId } = parsed.data;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: req.userId!,
        parentId,
      },
    });
    res.status(201).json({
      message: "Comment posted successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const comments = await prisma.comment.findMany({
    where: {
      postId,
      parentId: null,
    },
    include: {
      author: { select: { userId: true, username: true } },
      replies: {
        include: {
          author: { select: { userId: true, username: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  res.status(200).json({
    data: comments,
  });
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  const parsed = updateCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { content } = parsed.data;

  try {
    const updated = await prisma.comment.update({
      where: { id: req.params.id },
      data: { content },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update comment" });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.comment.delete({ where: { id: req.params.id } });
    res.json({ message: "Comment deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
