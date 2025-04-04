import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { verifyCSRFToken } from "@/lib/csrf-token";
import { createJWT } from "@/lib/session";
import { SignInSchema } from "@/schemas";
import { SessionPayload } from "@/types";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";

const app = new Hono()
    .post(
        '/',
        zValidator("json", SignInSchema),
        async (c) => {
            try {
                // Get the environment variables
                const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
                const clientSecret = process.env.GITHUB_CLIENT_SECRET;

                // Check if any of the environment variables are missing
                if (!clientId || !clientSecret) {
                    throw new Error('Missing GitHub OAuth environment variables');
                }

                // Get the code and state
                const { code, state } = c.req.valid("json");

                // Verify the state
                const isVerifiedState = await verifyCSRFToken(state);
                if (!isVerifiedState) {
                    throw new Error('Failed to verify state');
                }

                // Fetch the access token
                const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        client_id: clientId,
                        client_secret: clientSecret,
                        code,
                    }),
                });

                // Chech for success
                if (!tokenResponse.ok) {
                    const errorData = await tokenResponse.json();
                    throw new Error(`GitHub access token fetch failed: ${errorData?.message}`);
                }

                const tokenData = await tokenResponse.json();

                // Get the token from the data
                const accessToken = tokenData?.access_token;

                // Fetch the user
                const userResponse = await fetch('https://api.github.com/user', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                // Check for success
                if (!userResponse.ok) {
                    const errorData = await userResponse.json();
                    throw new Error(`GitHub user fetch failed: ${errorData?.message}`);
                }

                const user = await userResponse.json();

                const name = user?.name || user.login;

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
                        name,
                        avatarUrl: user.avatar_url,
                    })
                    .where(eq(usersTable.githubId, user.id))
                    .returning();

                    // Create the session JWTs
                    const payload: SessionPayload = {
                        id: updatedUser.id,
                        name,
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

                    return c.json({ success: true });
                }

                // If user doesn't exist, create a new user
                const [newUser] = await db.insert(usersTable).values({
                    githubId: user.id,
                    name,
                    avatarUrl: user.avatar_url,
                })
                .returning();

                // Create the session JWTs
                const payload: SessionPayload = {
                    id: newUser.id,
                    name,
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
                
                return c.json({ success: true });
            }
            catch (error) {
                console.error(error);
                return c.json({ success: false }, { status: 500 });
            }
        }
    )

export default app;