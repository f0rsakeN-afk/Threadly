import z from "zod";

const commentSchema = z.object({
  content: z.string().min(1, "Content must have at least one character"),
  postId: z.string(),
  parentId: z.string().optional(),
});

const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

export { commentSchema, updateCommentSchema };
