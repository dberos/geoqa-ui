import { db } from "@/db";
import { chatsTable, messagesTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/hono-middleware";
import { PostMessageSchema } from "@/schemas";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
    .post(
        '/:chatId',
        sessionMiddleware,
        zValidator("json", PostMessageSchema),
        async (c) => {
            try {
                const session = c.get('session');
                const userId = session?.id
                if (!session || !userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const { question, query } = c.req.valid("json");
                const chatId = c.req.param('chatId');

                const [chat] = await db
                .select()
                .from(chatsTable)
                .where(eq(chatsTable.id, chatId));
                if (chat?.userId !== userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const [message] = await db.insert(messagesTable).values({
                    chatId: chatId,
                    question,
                    query
                }).returning();

                return c.json({ messageId: message.id });
            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
        }
    )

export default app;