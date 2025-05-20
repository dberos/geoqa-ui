import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { createJWT, decodeJWT, verifyJWT } from "./session";
import { SessionPayload } from "@/types";
import { v4 as uuidv4 } from 'uuid';

type MiddlewareContext = {
    Variables: {
        session: SessionPayload | null;
    }
}

export const userMiddleware = createMiddleware<MiddlewareContext>(
    async (c, next) => {
        // This is used for UI only
        // Access token refresh early in next.js middleware
        // But maybe there is no middleware call and access token gets invalid
        // So only decode the token
        const accessToken = getCookie(c, 'accessToken') || '';
        if (!accessToken) {
            c.set('session', null);
        }
        else {
            const decodedAccessToken = await decodeJWT(accessToken);
            if (!decodedAccessToken) {
                c.set('session', null);
            }
            else {
                c.set('session', decodedAccessToken);
            }
        }
        await next();
    }
);

export const sessionMiddleware = createMiddleware<MiddlewareContext>(
    async (c, next) => {
        try {
            // Get the access and refresh tokens from the request
            const accessToken = getCookie(c, 'accessToken') || '';
            const refreshToken = getCookie(c, 'refreshToken') || '';

            if (!accessToken || !refreshToken) {
                deleteCookie(c, 'accessToken');
                deleteCookie(c, 'refreshToken');
                c.set('session', null);
                return c.json({ error: 'Unauthorized' }, { status: 401 });
            }

            // Don't refresh the token in GET requests
            if (c.req.method === 'GET') {
                // If the request is a GET request, just decode the access token
                // It is not state changing
                // It can be cached, subsequent to a successful state changing request
                // When during that, the access token expired
                const decodedAccessToken = await decodeJWT(accessToken);
                if (!decodedAccessToken) {
                    deleteCookie(c, 'accessToken');
                    deleteCookie(c, 'refreshToken');
                    c.set('session', null);
                    return new Response(null, { status: 204 });
                }
                c.set('session', decodedAccessToken);
                await next();
                return;
            }

            // Verify the access token
            const verifiedAccessToken = await verifyJWT(accessToken);
            if (!verifiedAccessToken) {
                const verifiedRefreshToken = await verifyJWT(refreshToken);

                // Verify the refresh token
                if (!verifiedRefreshToken) {
                    deleteCookie(c, 'accessToken');
                    deleteCookie(c, 'refreshToken');
                    c.set('session', null);
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }
                else {
                    /**
                     * Here the rotation takes place
                     * If session doesn't exist, delete the cookies
                     * If session exists, check if oldJti is blacklisted
                     * If it is not, then blacklist and insert the new jti in the db
                     * If it is blacklisted then delete the session from the db and the cookies
                     */

                    // Extract the sessionId and jti from the refresh token
                    const sessionId = verifiedRefreshToken.sessionId || "";
                    const oldJti = verifiedRefreshToken.jti || "";

                    // Generate a new jti
                    const jti = uuidv4();

                    // Decode the access token payload
                    const decodedAccessToken = await decodeJWT(accessToken);
                    if (!decodedAccessToken) {
                        deleteCookie(c, 'accessToken');
                        deleteCookie(c, 'refreshToken');
                        c.set('session', null);
                        return c.json({ error: 'Unauthorized' }, { status: 401 });
                    }

                    // Generate new access and refresh tokens
                    const newAccessToken = await createJWT(decodedAccessToken, '1m') || "";
                    const newRefreshToken = await createJWT(verifiedRefreshToken, '1d', jti) || "";

                    // Get the exact exp to be stored
                    const decodedRefreshToken = await decodeJWT(newRefreshToken);
                    const now = Math.floor(Date.now() / 1000);
                    const exp = decodedRefreshToken?.exp || now + 86400;

                    // Call the refresh route
                    const refreshUrl = process.env.NEXT_PUBLIC_APP_URL as string + "/api/auth/refresh";
                    const refreshResponse = await fetch(refreshUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${refreshToken}`,
                        },
                        body: JSON.stringify({
                            sessionId,
                            oldJti,
                            jti,
                            exp
                        }),
                    });
                    if (!refreshResponse.ok) {
                        deleteCookie(c, 'accessToken');
                        deleteCookie(c, 'refreshToken');
                        c.set('session', null);
                        return c.json({ error: 'Unauthorized' }, { status: 401 });
                    }
                    const { success } = await refreshResponse.json();
                    if (!success) {
                        deleteCookie(c, 'accessToken');
                        deleteCookie(c, 'refreshToken');
                        c.set('session', null);
                        return c.json({ error: 'Unauthorized' }, { status: 401 });
                    }

                    setCookie(c, 'accessToken', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 24,
                        path: '/'
                    });
                    setCookie(c, 'refreshToken', newRefreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 24,
                        path: '/'
                    });
                    const verifiedNewAccessToken = await verifyJWT(newAccessToken);
                    c.set('session', verifiedNewAccessToken);
                    await next();
                }
            }
            else {
                // Have to set the response cookies in case the access token hasn't expired
                setCookie(c, 'accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24,
                    path: '/'
                });
                setCookie(c, 'refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24,
                    path: '/'
                });
                c.set('session', verifiedAccessToken);
                await next();
            }
        }
        catch (error) {
            console.error(error);
            deleteCookie(c, 'accessToken');
            deleteCookie(c, 'refreshToken');
            c.set('session', null);
            return c.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }
);

export const corsMiddleware = createMiddleware(
    async (c, next) => {
        const origin = c.req.header('origin');
        const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL!;
        const isAllowedOrigin = !origin || origin === allowedOrigin;
        const allowedMethods = ["GET", "POST", "PATCH", "DELETE", "OPTIONS"];

        // Block CORS requests from unauthorized origins
        if (origin && !isAllowedOrigin) {
            return c.json(
                { error: 'Request blocked from CORS policy' },
                { status: 403 }
            );
        }

        // Add CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': allowedOrigin,
            "Access-Control-Allow-Methods": allowedMethods.join(",")
        };

        // Handle preflight request
        if (c.req.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        // Set CORS headers
        Object.entries(corsHeaders).forEach(([key, value]) => c.res.headers.set(key, value));

        await next();
    }
);

export const cspMiddleware = createMiddleware(
    async(c, next) => {
        if (process.env.NODE_ENV === 'development') {
            await next();
            return;
        }
        const cspHeader = `
        default-src 'none';
        frame-ancestors 'none';
        `;
        const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, ' ')
        .trim();

        c.res.headers.set(
            'Content-Security-Policy',
            contentSecurityPolicyHeaderValue
        );
        await next();
    }
);