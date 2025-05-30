import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/hono-middleware";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";

const app = new Hono()
    .delete(
        '/:userId',
        sessionMiddleware,
        async (c) => {
            try {
                const session = c.get('session');
                const userId = session?.id
                if (!session || !userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const paramUserId = c.req.param('userId');
                if (!paramUserId) {
                    return c.json({ error: 'No present userId' }, { status: 400 });
                }

                if (paramUserId !== userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await db
                .delete(usersTable)
                .where(eq(usersTable.id, userId));

                deleteCookie(c, 'accessToken');
                deleteCookie(c, 'refreshToken');

                return c.json({ success: true });
            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
        }
    )

export default app;