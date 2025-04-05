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
                const response = await fetch('https://github.com/login/oauth/access_token', {
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
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`GitHub access token fetch failed: ${errorData?.message}`);
                }

                const data = await response.json();

                // Get the token from the data
                const accessToken: string = data.access_token;

                return c.json({ accessToken });
            }
            catch (error) {
                console.error(error);
                return c.json({ accessToken: null }, { status: 500 })
            }
        }
    )
    .post(
        '/user',
        zValidator("json", SignInUserSchema),
        async (c) => {
            try {
                const { accessToken } = c.req.valid("json");
                // Fetch the user
                const response = await fetch('https://api.github.com/user', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                // Check for success
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`GitHub user fetch failed: ${errorData?.message}`);
                }

                const userJson = await response.json();
                const user: OathUserType = {
                    id: userJson.id.toString(),
                    name: userJson?.name || userJson.login,
                    avatarUrl: userJson.avatar_url,
                    type: OathEnum.GITHUB
                };
                return c.json({ user });
            }
            catch (error) {
                console.error(error);
                return c.json({ user: null }, { status: 500 })
            }
        }
    )

export default app;