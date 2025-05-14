import { db } from "@/db";
import { chatsTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/hono-middleware";
import { asc, eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
    .get(
        '/:userId',
        sessionMiddleware,
        async (c) => {
            try {
                const userId = c.req.param('userId');
                if (!userId) {
                    return c.json({ error: 'No present userId' }, { status: 400 });
                }

                const session = c.get('session');
                const sessionUserId = session?.id
                if (sessionUserId !== userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const chats = await db
                .select()
                .from(chatsTable)
                .where(eq(chatsTable.userId, userId))
                .orderBy(asc(chatsTable.createdAt));

                return c.json({ chats });
            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
        }
    )

export default app;