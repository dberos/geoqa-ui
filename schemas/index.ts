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