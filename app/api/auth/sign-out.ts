import { db } from "@/db";
import { sessionsTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/hono-middleware";
import { verifyJWT } from "@/lib/session";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";

const app = new Hono()
    .post(
        '/', 
        sessionMiddleware,
        async (c) => {
        try {
            const refreshToken = getCookie(c, 'refreshToken') || "";
            // Get the sessionId from the refresh token and delete current session
            const verifiedRefreshToken = await verifyJWT(refreshToken);
            if (!verifiedRefreshToken) {
                deleteCookie(c, 'accessToken');
                deleteCookie(c, 'refreshToken');
                return c.json({ error: 'Unauthorized' }, { status: 401 });
            }
            
            const sessionId = verifiedRefreshToken?.sessionId || "";
            await db
            .delete(sessionsTable)
            .where(eq(sessionsTable.id, sessionId));

            deleteCookie(c, 'accessToken');
            deleteCookie(c, 'refreshToken');
            return c.json({ success: true });
        }
        catch (error) {
            console.error(error);
            return c.json({ error: 'Failed to sign out' }, { status: 500 });
        }
    })

export default app;