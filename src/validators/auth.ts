import z from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});
