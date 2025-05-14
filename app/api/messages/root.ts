import { db } from "@/db";
import { chatsTable, messagesTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/hono-middleware";
import { asc, eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
    .get(
        '/:chatId',
        sessionMiddleware,
        async (c) => {
            try {
                const chatId = c.req.param('chatId');
                if (!chatId) {
                    return c.json({ error: 'Not present chatId' }, { status: 400 });
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

                const messages = await db
                .select()
                .from(messagesTable)
                .where(eq(messagesTable.chatId, chatId))
                .orderBy(asc(messagesTable.createdAt));

                return c.json({ messages });
            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
        }
    )
    .patch(
        '/:messageId',
        sessionMiddleware,
        async (c) => {
            try {
                const messageId = c.req.param('messageId');
                if (!messageId) {
                    return c.json({ error: 'Not present chatId' }, { status: 400 });
                }
                const [message] = await db
                .select()
                .from(messagesTable)
                .where(eq(messagesTable.id, messageId));

                if (!message.question) {
                    return c.json({ error: 'Not present question' }, { status: 400 });
                }

                const response = await fetch(process.env.NLQ_API_URL!, {
                    method: 'POST',
                    headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                    },    
                    body: new URLSearchParams({
                        question: message.question
                    })
                });
                const result = await response.json();

                const [updatedMessage] = await db
                .update(messagesTable)
                .set({
                    isLoading: false,
                    query: result.query,
                    queryResults: result.queryResults,
                    textualResponse: result.textualResponse,
                    errorMessage: result.errorMessage
                })
                .where(eq(messagesTable.id, messageId))
                .returning();

                return c.json({ message: updatedMessage });
            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
        }
    )

export default app;