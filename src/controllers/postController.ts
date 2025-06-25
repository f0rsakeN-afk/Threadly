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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const subreddit = await prisma.subreddit.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });

  if (!subreddit) return res.status(404).json({ error: "Subreddit not found" });

  const posts = await prisma.post.findMany({
    where: { subredditId: subreddit.id },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { username: true } },
    },
  });

  // Fetch vote scores for all post IDs
  const voteScores = await prisma.vote.groupBy({
    by: ["postId"],
    where: {
      postId: { in: posts.map((p) => p.id) },
    },
    _sum: {
      value: true,
    },
  });

  // Map postId → score
  const scoreMap = new Map(voteScores.map(v => [v.postId, v._sum.value || 0]));

  const postsWithScores = posts.map(post => ({
    ...post,
    voteScore: scoreMap.get(post.id) || 0,
  }));

  res.status(200).json({
    page,
    limit,
    results: postsWithScores.length,
    data: {
      ...subreddit,
      posts: postsWithScores,
    },
  });
};

export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { username: true, userId: true },
      },
      subreddit: {
        select: { name: true, slug: true },
      },
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { username: true } },
          replies: {
            include: {
              author: { select: { username: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post)
    return res.status(404).json({
      error: "Post not found",
    });

  const voteScore = await prisma.vote.aggregate({
    where: { postId: id },
    _sum: { value: true },
  });

  res.status(200).json({
    ...post,
    voteScore: voteScore._sum.value || 0,
  });
};
