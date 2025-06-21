import z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(4, "Post title must be at least 4 characters long")
    .max(200, "Post title cannot have more than 200 characters"),
  content: z.string().optional(),
  subredditSlug: z.string().min(1, "Subreddit slug is required"),
});
