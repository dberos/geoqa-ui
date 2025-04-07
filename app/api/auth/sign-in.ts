import { db } from "@/db";
import { sessionsTable, tokensTable, usersTable } from "@/db/schema";
import { createJWT, decodeJWT } from "@/lib/session";
import { SignInSchema } from "@/schemas";
import { OathEnum, OathUserType, SessionPayload } from "@/types";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Context, Hono } from "hono";
import { setCookie } from "hono/cookie";
import { v4 as uuidv4 } from 'uuid';

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

            // Delete all inactive user sessions
            const sessions = await db
            .select()
            .from(sessionsTable)
            .where(eq(sessionsTable.userId, updatedUser.id));

            const now = Math.floor(Date.now() / 1000);

            for (const session of sessions) {
                // Get all tokens for the session
                const tokens = await db
                .select()
                .from(tokensTable)
                .where(eq(tokensTable.sessionId, session.id));

                // Check if all tokens have expired
                const allTokensExpired = tokens.every(token => token.exp < now);

                if (allTokensExpired) {
                    // Delete the session if all its tokens are expired
                    await db
                    .delete(sessionsTable)
                    .where(eq(sessionsTable.id, session.id));
                }
            }

            // Create a new session
            const [newSession] = await db
            .insert(sessionsTable)
            .values({ userId: updatedUser.id })
            .returning();

            // Create a jti for the refresh token
            const jti = uuidv4();

            // Create the session JWTs
            const accessPayload: SessionPayload = {
                id: updatedUser.id,
                name: updatedUser.name,
                avatarUrl: updatedUser.avatarUrl
            };
            const refreshPayload: SessionPayload = {
                sessionId: newSession.id,
            }

            const newAccessToken = await createJWT(accessPayload, '10s') || "";
            const newRefreshToken = await createJWT(refreshPayload, '1h', jti) || "";

            // Get the exact exp of the token to be stored
            const decodedRefreshToken = await decodeJWT(newRefreshToken);
            const exp = decodedRefreshToken?.exp ||  now + 3600;

            // Insert the token's fields to the tokens table
            await db
            .insert(tokensTable)
            .values({
                sessionId: newSession.id,
                jti,
                exp,
            });

            // Set the cookies
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

            // Delete all inactive user sessions
            const sessions = await db
            .select()
            .from(sessionsTable)
            .where(eq(sessionsTable.userId, newUser.id));

            const now = Math.floor(Date.now() / 1000);

            for (const session of sessions) {
                // Get all tokens for the session
                const tokens = await db
                .select()
                .from(tokensTable)
                .where(eq(tokensTable.sessionId, session.id));

                // Check if all tokens have expired
                const allTokensExpired = tokens.every(token => token.exp < now);

                if (allTokensExpired) {
                    // Delete the session if all its tokens are expired
                    await db
                    .delete(sessionsTable)
                    .where(eq(sessionsTable.id, session.id));
                }
            }

            // Create a new session
            const [newSession] = await db
            .insert(sessionsTable)
            .values({ userId: newUser.id })
            .returning();

            // Create a jti for the refresh token
            const jti = uuidv4();

            // Create the session JWTs
            const accessPayload: SessionPayload = {
                id: newUser.id,
                name: newUser.name,
                avatarUrl: newUser.avatarUrl
            };
            const refreshPayload: SessionPayload = {
                sessionId: newSession.id,
            }

            const newAccessToken = await createJWT(accessPayload, '10s') || "";
            const newRefreshToken = await createJWT(refreshPayload, '1h', jti) || "";

            // Get the exact exp of the token to be stored
            const decodedRefreshToken = await decodeJWT(newRefreshToken);
            const exp = decodedRefreshToken?.exp ||  now + 3600;

            // Insert the token's fields to the tokens table
            await db
            .insert(tokensTable)
            .values({
                sessionId: newSession.id,
                jti,
                exp,
            });

            // Set the cookies
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

            // Delete all inactive user sessions
            const sessions = await db
            .select()
            .from(sessionsTable)
            .where(eq(sessionsTable.userId, updatedUser.id));

            const now = Math.floor(Date.now() / 1000);

            for (const session of sessions) {
                // Get all tokens for the session
                const tokens = await db
                .select()
                .from(tokensTable)
                .where(eq(tokensTable.sessionId, session.id));

                // Check if all tokens have expired
                const allTokensExpired = tokens.every(token => token.exp < now);

                if (allTokensExpired) {
                    // Delete the session if all its tokens are expired
                    await db
                    .delete(sessionsTable)
                    .where(eq(sessionsTable.id, session.id));
                }
            }

            // Create a new session
            const [newSession] = await db
            .insert(sessionsTable)
            .values({ userId: updatedUser.id })
            .returning();

            // Create a jti for the refresh token
            const jti = uuidv4();

            // Create the session JWTs
            const accessPayload: SessionPayload = {
                id: updatedUser.id,
                name: updatedUser.name,
                avatarUrl: updatedUser.avatarUrl
            };
            const refreshPayload: SessionPayload = {
                sessionId: newSession.id,
            }

            const newAccessToken = await createJWT(accessPayload, '10s') || "";
            const newRefreshToken = await createJWT(refreshPayload, '1h', jti) || "";

            // Get the exact exp of the token to be stored
            const decodedRefreshToken = await decodeJWT(newRefreshToken);
            const exp = decodedRefreshToken?.exp ||  now + 3600;

            // Insert the token's fields to the tokens table
            await db
            .insert(tokensTable)
            .values({
                sessionId: newSession.id,
                jti,
                exp,
            });

            // Set the cookies
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

            // Delete all inactive user sessions
            const sessions = await db
            .select()
            .from(sessionsTable)
            .where(eq(sessionsTable.userId, newUser.id));

            const now = Math.floor(Date.now() / 1000);

            for (const session of sessions) {
                // Get all tokens for the session
                const tokens = await db
                .select()
                .from(tokensTable)
                .where(eq(tokensTable.sessionId, session.id));

                // Check if all tokens have expired
                const allTokensExpired = tokens.every(token => token.exp < now);

                if (allTokensExpired) {
                    // Delete the session if all its tokens are expired
                    await db
                    .delete(sessionsTable)
                    .where(eq(sessionsTable.id, session.id));
                }
            }

            // Create a new session
            const [newSession] = await db
            .insert(sessionsTable)
            .values({ userId: newUser.id })
            .returning();

            // Create a jti for the refresh token
            const jti = uuidv4();

            // Create the session JWTs
            const accessPayload: SessionPayload = {
                id: newUser.id,
                name: newUser.name,
                avatarUrl: newUser.avatarUrl
            };
            const refreshPayload: SessionPayload = {
                sessionId: newSession.id,
            }

            const newAccessToken = await createJWT(accessPayload, '10s') || "";
            const newRefreshToken = await createJWT(refreshPayload, '1h', jti) || "";

            // Get the exact exp of the token to be stored
            const decodedRefreshToken = await decodeJWT(newRefreshToken);
            const exp = decodedRefreshToken?.exp ||  now + 3600;

            // Insert the token's fields to the tokens table
            await db
            .insert(tokensTable)
            .values({
                sessionId: newSession.id,
                jti,
                exp,
            });

            // Set the cookies
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