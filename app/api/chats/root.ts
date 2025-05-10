import { db } from "@/db";
import { chatsTable, messagesTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { PostChatSchema } from "@/schemas";
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
                if (!session || !userId) throw new Error('No session present');
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
                return c.json({ chatId: null, messageId: null });
            }
    })
    .get(
        '/:chatId',
        sessionMiddleware,
        async (c) => {
            try {
                const chatId = c.req.param('chatId');
                if (!chatId) throw new Error ('No present chatId');
                const messages = await db
                .select()
                .from(messagesTable)
                .where(eq(messagesTable.chatId, chatId));

                return c.json({ messages });
            }
            catch (error) {
                console.error(error);
                return c.json({ messages: null });
            }
        }
    )

export default app;