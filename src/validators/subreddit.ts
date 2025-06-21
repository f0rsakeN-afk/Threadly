import z from "zod";

export const subredditSchema = z.object({
  name: z
    .string()
    .min(3, "Subreddit name must be at least 6 characters long")
    .max(21, "Subreddit name must be under 21 characters")
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Subreddit name can only contain letters, numbers, and underscores",
    }),
});
