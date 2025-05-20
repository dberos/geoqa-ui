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

                const messageIds = await db
                .select()
                .from(messagesTable)
                .where(eq(messagesTable.chatId, chatId))
                .orderBy(asc(messagesTable.createdAt));

                return c.json({ messageIds });
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

                const session = c.get('session');
                const userId = session?.id
                if (!session || !userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const [message] = await db
                .select()
                .from(messagesTable)
                .where(eq(messagesTable.id, messageId));

                if (message?.userId !== userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                if (message.question) {
                    const response = await fetch(process.env.NLQ_API_URL!, {
                        method: 'POST',
                        headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                        },    
                        body: new URLSearchParams({
                            question: message.question
                        })
                    });

                    if (!response.ok) {
                        const [updatedMessage] = await db
                        .update(messagesTable)
                        .set({ errorMessage: 'Failed to generate answer' })
                        .where(eq(messagesTable.id, messageId))
                        .returning();

                        return c.json({ 
                            message: updatedMessage, 
                            text: 'Failed to generate response from GeoQA API'
                        }, { 
                            status: 200
                        });
                    }

                    const result = await response.json();
                    if (result.errorMessage) {
                        const [updatedMessage] = await db
                        .update(messagesTable)
                        .set({ errorMessage: result.errorMessage })
                        .where(eq(messagesTable.id, messageId))
                        .returning();

                        return c.json({ 
                            message: updatedMessage, 
                            text: 'Failed to generate response from GeoQA API'
                        }, { 
                            status: 200
                        });
                    }

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
                
                if (!message.query) {
                    const [updatedMessage] = await db
                    .update(messagesTable)
                    .set({ errorMessage: 'Failed to generate answer' })
                    .where(eq(messagesTable.id, messageId))
                    .returning();

                    return c.json({ 
                        message: updatedMessage, 
                        text: 'Failed to generate response from GeoQA API'
                    }, { 
                        status: 200
                    });
                }

                const response = await fetch(process.env.SPARQL_API_URL!, {
                    method: 'POST',
                    headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                    },    
                    body: new URLSearchParams({
                        sparql: message.query
                    })
                });

                if (!response.ok) {
                    const [updatedMessage] = await db
                    .update(messagesTable)
                    .set({ errorMessage: 'Failed to generate answer' })
                    .where(eq(messagesTable.id, messageId))
                    .returning();

                    return c.json({ 
                        message: updatedMessage, 
                        text: 'Failed to generate response from GeoQA API'
                    }, { 
                        status: 200
                    });
                }

                const result = await response.json();
                if (result.errorMessage) {
                    const [updatedMessage] = await db
                    .update(messagesTable)
                    .set({ errorMessage: result.errorMessage })
                    .where(eq(messagesTable.id, messageId))
                    .returning();

                    return c.json({ 
                        message: updatedMessage, 
                        text: 'Failed to generate response from GeoQA API'
                    }, { 
                        status: 200
                    });
                }

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

                const messageId = c.req.param('messageId');
                if (!messageId) {
                    return c.json({ error: 'Not present chatId' }, { status: 400 });
                }

                const [updatedMessage] = await db
                .update(messagesTable)
                .set({ errorMessage: 'Failed to generate answer' })
                .where(eq(messagesTable.id, messageId))
                .returning();

                return c.json({ 
                    message: updatedMessage, 
                    text: 'Failed to generate response from GeoQA API'
                }, { 
                    status: 200
                });
            }
        }
    )
    .delete(
        '/:messageId',
        sessionMiddleware,
        async (c) => {
            try {
                const messageId = c.req.param('messageId');
                if (!messageId) {
                    return c.json({ error: 'Not present chatId' }, { status: 400 });
                }

                const session = c.get('session');
                const userId = session?.id
                if (!session || !userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const [message] = await db
                .select()
                .from(messagesTable)
                .where(eq(messagesTable.id, messageId));

                if (!message) {
                    return c.json({ error: 'No present message' }, { status: 400 });
                }

                await db
                .delete(messagesTable)
                .where(eq(messagesTable.id, messageId));

                return c.json({ success: true });
            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
        }
    )

export default app;