import { db } from "@/db";
import { chatsTable, messagesTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/hono-middleware";
import { PostChatSchema, UpdateChatNameSchema } from "@/schemas";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
    .post(
        '/', 
        sessionMiddleware,
        zValidator("json", PostChatSchema),
        async (c) => {
            try {
                const session = c.get('session');
                const userId = session?.id
                if (!session || !userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }
                const { question } = c.req.valid("json");
                const [chat] = await db.insert(chatsTable).values({
                    userId
                }).returning();

                const [message] = await db.insert(messagesTable).values({
                    chatId: chat.id,
                    question
                }).returning()

                return c.json({ chatId: chat.id, messageId: message.id });
            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
    })
    .patch(
        '/:chatId',
        sessionMiddleware,
        zValidator("json", UpdateChatNameSchema),
        async (c) => {
            try {
                const chatId = c.req.param('chatId');
                if (!chatId) {
                    return c.json({ error: 'No present chatId' }, { status: 400 });
                }

                const [chat] = await db
                .select()
                .from(chatsTable)
                .where(eq(chatsTable.id, chatId));

                const session = c.get('session');
                const userId = session?.id
                if (!session || !userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                if (chat?.userId !== userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const { name } = c.req.valid("json");

                await db
                .update(chatsTable)
                .set({ name })
                .where(eq(chatsTable.id, chatId));

                return c.json({ success: true });

            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
        }
    )
    .delete(
        '/:chatId',
        sessionMiddleware,
        async (c) => {
            try {
                const chatId = c.req.param('chatId');
                if (!chatId) {
                    return c.json({ error: 'No present chatId' }, { status: 400 });
                }

                const [chat] = await db
                .select()
                .from(chatsTable)
                .where(eq(chatsTable.id, chatId));

                const session = c.get('session');
                const userId = session?.id
                if (!session || !userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                if (chat?.userId !== userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                await db
                .delete(chatsTable)
                .where(eq(chatsTable.id, chatId));

                return c.json({ success: true });
            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
        }
    )

export default app;