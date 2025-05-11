import { OathEnum } from "@/types";
import { z } from "zod";

export const SignInTokenSchema = z.object({
    code: z.string(),
    state: z.string()
});

export const SignInUserSchema = z.object({
    accessToken: z.string()
});

export const SignInSchema = z.object({
    user: z.object({
        id: z.string(),
        name: z.string(),
        avatarUrl: z.string(),
        type: z.nativeEnum(OathEnum)
    })
});

export const RefreshSchema = z.object({
    sessionId: z.string(),
    oldJti: z.string(),
    jti: z.string(),
    exp: z.number()
});

export const PostChatSchema = z.object({
    question: z.string()
});

export const UpdateChatNameSchema = z.object({
    name: z.string().min(4).max(255),
});