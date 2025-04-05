import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { createJWT } from "@/lib/session";
import { SignInSchema } from "@/schemas";
import { OathEnum, OathUserType, SessionPayload } from "@/types";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Context, Hono } from "hono";
import { setCookie } from "hono/cookie";

const app = new Hono()
    .post(
        '/',
        zValidator("json", SignInSchema),
        async (c) => {
            try {
                const { user } = c.req.valid("json");
    
                switch (user.type) {
                    case OathEnum.GITHUB:
                        return await signInWithGitHub(user, c);
                    case OathEnum.GOOGLE:
                        return await signInWithGoogle(user, c);
                    default:
                        return c.json({ success: false }, { status: 500 });
                }
            }
            catch (error) {
                console.error(error);
                return c.json({ success: false }, { status: 500 });
            }
        }
    )

const signInWithGitHub = async (user: OathUserType, c: Context) => {
    try {
        const [existingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.githubId, user.id))
        .limit(1);

        if (existingUser) {
            // If user exists, update their profile if needed
            const [updatedUser] = await db
            .update(usersTable)
            .set({
                name: user.name,
                avatarUrl: user.avatarUrl,
            })
            .where(eq(usersTable.githubId, user.id))
            .returning();

            // Create the session JWTs
            const payload: SessionPayload = {
                id: updatedUser.id,
                name: updatedUser.name,
                avatarUrl: updatedUser.avatarUrl,
            }

            const newAccessToken = await createJWT(payload, '10s') || "";
            const newRefreshToken = await createJWT(payload, '1h') || "";

            setCookie(c, 'accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
                path: '/',
            });

            setCookie(c, 'refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
                path: '/',
            });
        }
        else {
            // If user doesn't exist, create a new user
            const [newUser] = await db.insert(usersTable).values({
                githubId: user.id,
                name: user.name,
                avatarUrl: user.avatarUrl,
            })
            .returning();

            // Create the session JWTs
            const payload: SessionPayload = {
                id: newUser.id,
                name: newUser.name,
                avatarUrl: newUser.avatarUrl,
            }

            const newAccessToken = await createJWT(payload, '10s') || "";
            const newRefreshToken = await createJWT(payload, '1h') || "";

            setCookie(c, 'accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
                path: '/',
            });

            setCookie(c, 'refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
                path: '/',
            });
        }
        return c.json({ success: true });
    }
    catch (error) {
        console.error(error);
        return c.json({ success: false }, { status: 500 });
    }
}

const signInWithGoogle = async (user: OathUserType, c: Context) => {
    try {
        const [existingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.googleId, user.id))
        .limit(1);

        if (existingUser) {
            // If user exists, update their profile if needed
            const [updatedUser] = await db
            .update(usersTable)
            .set({
                name: user.name,
                avatarUrl: user.avatarUrl,
            })
            .where(eq(usersTable.googleId, user.id))
            .returning();

            // Create the session JWTs
            const payload: SessionPayload = {
                id: updatedUser.id,
                name: updatedUser.name,
                avatarUrl: updatedUser.avatarUrl,
            }

            const newAccessToken = await createJWT(payload, '10s') || "";
            const newRefreshToken = await createJWT(payload, '1h') || "";

            setCookie(c, 'accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
                path: '/',
            });

            setCookie(c, 'refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
                path: '/',
            });
        }
        else {
            // If user doesn't exist, create a new user
            const [newUser] = await db.insert(usersTable).values({
                googleId: user.id,
                name: user.name,
                avatarUrl: user.avatarUrl,
            })
            .returning();

            const payload: SessionPayload = {
                id: newUser.id,
                name: newUser.name,
                avatarUrl: newUser.avatarUrl,
            }

            // Create the session JWTs
            const newAccessToken = await createJWT(payload, '10s') || "";
            const newRefreshToken = await createJWT(payload, '1h') || "";

            setCookie(c, 'accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
                path: '/',
            });

            setCookie(c, 'refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
                path: '/',
            });
        }
        return c.json({ success: true });
    }
    catch (error) {
        console.error(error);
        return c.json({ success: false }, { status: 500 });
    }
}

export default app;