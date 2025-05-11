import { db } from "@/db";
import { chatsTable, messagesTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
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
    .patch(
        '/:chatId',
        sessionMiddleware,
        zValidator("json", UpdateChatNameSchema),
        async (c) => {
            try {
                const chatId = c.req.param('chatId');
                if (!chatId) throw new Error ('No present chatId');

                const [chat] = await db
                .select()
                .from(chatsTable)
                .where(eq(chatsTable.id, chatId));

                const session = c.get('session');
                const userId = session?.id
                if (!session || !userId) throw new Error('No session present');

                if (chat?.userId !== userId) throw new Error ('Unauthorized');

                const { name } = c.req.valid("json");

                await db
                .update(chatsTable)
                .set({ name })
                .where(eq(chatsTable.id, chatId));

                return c.json({ success: true });

            }
            catch (error) {
                console.error(error);
                return c.json({ success: false });
            }
        }
    )

export default app;