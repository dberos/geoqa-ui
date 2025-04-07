import { db } from "@/db";
import { sessionsTable } from "@/db/schema";
import { verifyJWT } from "@/lib/session";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";

const app = new Hono()
    .post('/', async (c) => {
        try {
            const refreshToken = getCookie(c, 'refreshToken') || "";
            // Get the sessionId from the refresh token and delete current session
            const verifiedRefreshToken = await verifyJWT(refreshToken);
            if (!verifiedRefreshToken) {
                // Maybe user was inactive and there was no middleware call
                // So the session will be deleted at next sign in
                deleteCookie(c, 'accessToken');
                deleteCookie(c, 'refreshToken');
                return c.json({ success: true });
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
            return c.json({ success: false }, { status: 500 });
        }
    })

export default app;