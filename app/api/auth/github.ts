import { verifyCSRFToken } from "@/lib/csrf-token";
import { SignInWithGitHubSchema } from "@/schemas";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono()
    .post(
        '/',
        zValidator("json", SignInWithGitHubSchema),
        async (c) => {
            try {
                // Get the environment variables
                const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
                const clientSecret = process.env.GITHUB_CLIENT_SECRET;

                // Check if any of the environment variables are missing
                if (!clientId || !clientSecret) {
                    throw new Error('Missing GitHub OAuth environment variables');
                }

                // Get the code
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

                // Get the json from the response
                const userJson = await userResponse.json();

                type GitHubUser = {
                    id: number | null;
                    login: string | null;
                    email: string | null;
                    name: string | null;
                    avatar_url: string | null;
                };
                
                const user: GitHubUser = {
                    id: userJson?.id,
                    login: userJson.login,
                    email: userJson?.email,
                    name: userJson?.name,
                    avatar_url: userJson?.avatar_url,
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