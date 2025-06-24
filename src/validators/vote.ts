import z from "zod";

export const voteSchema = z.object({
  postId: z.string(),
  value: z.enum(["1", "-1"]),
});
