import { db } from "@/db";
import { chatsTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { asc, eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
    .get(
        '/:userId',
        sessionMiddleware,
        async (c) => {
            try {
                const userId = c.req.param('userId');
                if (!userId) throw new Error ('No present userId');
                const session = c.get('session');
                const sessionUserId = session?.id
                if (sessionUserId !== userId) throw new Error('Not Authorized');
                const chats = await db
                .select()
                .from(chatsTable)
                .where(eq(chatsTable.userId, userId))
                .orderBy(asc(chatsTable.createdAt));

                return c.json({ chats });
            }
            catch (error) {
                console.error(error);
                return c.json({ chats: null });
            }
        }
    )

export default app;