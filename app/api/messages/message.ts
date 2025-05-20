import { db } from "@/db";
import { messagesTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/hono-middleware";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
    .get(
        '/:messageId',
        sessionMiddleware,
        async (c) => {
            try {
                const messageId = c.req.param('messageId');
                if (!messageId) {
                    return c.json({ error: 'Not present messageId' }, { status: 400 });
                }

                const session = c.get('session');
                const userId = session?.id
                if (!session || !userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const [message] = await db
                .select()
                .from(messagesTable)
                .where(eq(messagesTable.id, messageId))

                if (message?.userId !== userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                return c.json({ message });
            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
        }
    )

export default app;