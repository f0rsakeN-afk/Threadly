import z from "zod";

const commentSchema = z.object({
  content: z.string().min(1, "Content must have at least one character"),
  postId: z.string(),
  parentId: z.string().optional(),
});

export default commentSchema;
