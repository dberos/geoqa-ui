import { verifyCSRFToken } from "@/lib/csrf-token";
import { SignInTokenSchema, SignInUserSchema } from "@/schemas";
import { OathEnum, OathUserType } from "@/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono()
    .post(
        '/token',
        zValidator("json", SignInTokenSchema),
        async (c) => {
            try {
                // Get the environment variables
                const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
                const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
                // Create redirectUri
                const redirectUri = process.env.NEXT_PUBLIC_APP_URL as string + "/auth/google/callback";

                // Check if any of the environment variables are missing
                if (!clientId || !clientSecret) {
                    return c.json({ error: 'Missing Google clientId or clientSecret' }, { status: 400 });
                }

                // Get the code and state
                const { code, state } = c.req.valid("json");

                // Verify the state
                const isVerifiedState = await verifyCSRFToken(state);
                if (!isVerifiedState) {
                    return c.json({ error: 'Failed to verify anti csrf token' }, { status: 401 });
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
                const response = await fetch(tokenUrl, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Check if the response is successful
                if (!response.ok) {
                    return c.json({ error: 'Failed to fetch Google access token' }, { status: 500 });
                }

                const data = await response.json();

                // Get the access token
                const accessToken: string = data.access_token;

                return c.json({ accessToken });
            }
            catch (error) {
                console.error(error);
                return c.json({ error: 'Failed to fetch Google access token' }, { status: 500 });
            }
        }
    )
    .post(
        '/user',
        zValidator("json", SignInUserSchema),
        async (c) => {
            const { accessToken } = c.req.valid("json");
            // Fetch the user
            const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Check if the response is successful
            if (!response.ok) {
                return c.json({ error: 'Failed to fetch Google user' }, { status: 500 });
            }

            const userJson = await response.json();
            const user: OathUserType = {
                id: userJson.sub.toString(),
                name: userJson.name || `${userJson.given_name} ${userJson.family_name}`.trim() || userJson.email,
                avatarUrl: userJson.picture,
                type: OathEnum.GOOGLE
            }
            return c.json({ user });
        }
    )

export default app;