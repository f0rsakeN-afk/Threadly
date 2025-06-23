import { AuthRequest } from "../middlewares/authMiddleware";
import { Response, Request } from "express";
import prisma from "../lib/prisma";
import { postSchema } from "../validators/post";

export const createPost = async (req: AuthRequest, res: Response) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });

  const { title, content, subredditSlug } = parsed.data;

  const subreddit = await prisma.subreddit.findUnique({
    where: { slug: subredditSlug },
  });
  if (!subreddit) return res.status(404).json({ error: "Subreddit not found" });

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: req.userId!,
      subredditId: subreddit.id,
    },
  });

  res.status(201).json({
    message: "Post created successfully",
    data: post,
  });
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: { title, content },
    });
    res.status(200).json({
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    res.status(400).json({ error: "Failed to update post" });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } });
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ error: "Post deletion failed" });
  }
};

export const getPostsBySubreddit = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const subreddit = await prisma.subreddit.findUnique({
    where: { slug },
    include: {
      posts: {
        include: {
          author: { select: { username: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!subreddit) return res.status(404).json({ error: "Subreddit not found" });

  res.status(200).json({
    results: subreddit.posts.length,
    data: subreddit,
  });
};
