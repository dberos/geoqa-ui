import "server-only";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { SessionPayload, verifyJWT } from "./session";

type MiddlewareContext = {
    Variables: {
        session: SessionPayload | null;
    }
}

export const sessionMiddleware = createMiddleware<MiddlewareContext>(
    async (c, next) => {
        // Session refreshes from Next middleware early
        // Here only authorize api routes, without Authorization header
        const accessToken = getCookie(c, 'accessToken') || '';

        if (!accessToken) {
            c.set('session', null);
            return c.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const verifiedAccessToken = await verifyJWT(accessToken);
        if (!verifiedAccessToken) {
            c.set('session', null);
            return c.json({ error: 'Unauthorized' }, { status: 401 });
        }
        else {
            c.set('session', verifiedAccessToken);
        }

        await next();
    }
)