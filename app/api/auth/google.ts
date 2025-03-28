import { verifyCSRFToken } from "@/lib/csrf-token";
import { SignInSchema } from "@/schemas";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

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
                console.log(redirectUri);

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

                // Get the json from the response
                const userJson = await userResponse.json();

                type GoogleUser = {
                    googleId: string | null;
                    email: string | null;
                    name: string | null;
                    avatarUrl: string | null;
                };
                
                const user: GoogleUser = {
                    googleId: userJson?.sub,
                    email: userJson?.email,
                    name: userJson?.name,
                    avatarUrl: userJson?.picture,
                };

                return c.json({ user });
            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
        }
    )

export default app;