import "server-only";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { decodeJWT } from "./session";
import { SessionPayload } from "@/types";

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
)
// TODO: Fix this since it gets the cookie from the request, not the update one
export const sessionMiddleware = createMiddleware<MiddlewareContext>(
    async (c, next) => {
        // Session refreshes from Next middleware early
        // Here only authorize api routes, without Authorization header
        // const accessToken = getCookie(c, 'accessToken') || '';
        // if (!accessToken) {
        //     c.set('session', null);
        //     return c.json({ error: 'Unauthorized' }, { status: 401 });
        // }
        // else {
        //     const verifiedAccessToken = await verifyJWT(accessToken);
        //     if (!verifiedAccessToken) {
        //         c.set('session', null);
        //         return c.json({ error: 'Unauthorized' }, { status: 401 });
        //     }
        //     else {
        //         c.set('session', verifiedAccessToken);
        //     }
        // }
        // await next();
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