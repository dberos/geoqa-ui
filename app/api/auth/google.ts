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
                const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
                const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
                // Create redirectUri
                const redirectUri = process.env.NEXT_PUBLIC_APP_URL as string + "/auth/google/callback";

                // Check if any of the environment variables are missing
                if (!clientId || !clientSecret) {
                    throw new Error('Missing Google OAuth environment variables');
                }

                // Get the code and state
                const { code, state } = c.req.valid("json");

                // Verify the state
                const isVerifiedState = await verifyCSRFToken(state);
                if (!isVerifiedState) {
                    throw new Error('Failed to verify state');
                }

                const tokenUrl = 'https://oauth2.googleapis.com/token';

                // Prepare JSON payload
                const body = {
                    code: code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code',
                };

                // Fetch the access token
                const tokenResponse = await fetch(tokenUrl, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Check if the response is successful
                if (!tokenResponse.ok) {
                    const errorData = await tokenResponse.json();
                    throw new Error(`Google access token fetch failed: ${errorData.error}`);
                }

                const tokenData = await tokenResponse.json();

                // Get the access token
                const accessToken = tokenData?.access_token;

                // Fetch the user
                const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                // Check if the response is successful
                if (!userResponse.ok) {
                    const errorData = await userResponse.json();
                    throw new Error(`Google user fetch failed: ${errorData.error || 'Unknown error'}`);
                }

                const user = await userResponse.json();

                const name = user.name || `${user.given_name} ${user.family_name}`.trim() || user.email;

                const [existingUser] = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.googleId, user.sub))
                .limit(1);

                if (existingUser) {
                    // If user exists, update their profile if needed
                    const [updatedUser] = await db
                    .update(usersTable)
                    .set({
                        name,
                        avatarUrl: user.picture,
                    })
                    .where(eq(usersTable.googleId, user.sub))
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
                    googleId: user.sub,
                    name,
                    avatarUrl: user.picture,
                })
                .returning();

                const payload: SessionPayload = {
                    id: newUser.id,
                    name,
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
                
                return c.json({ success: true });
            }
            catch (error) {
                console.error(error);
                return c.json({ success: false }, { status: 500 });
            }
        }
    )

export default app;