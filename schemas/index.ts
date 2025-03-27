import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4)
});

export const helloSchema = z.object({
    message: z.string()
});

export const SignInWithGitHubSchema = z.object({
    code: z.string(),
    state: z.string()
});