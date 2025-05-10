import { db } from "@/db";
import { messagesTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
    .post(
        '/:messageId',
        sessionMiddleware,
        async (c) => {
            try {
                const messageId = c.req.param('messageId');
                if (!messageId) throw new Error ('No present messageId');
                const [message] = await db
                .select()
                .from(messagesTable)
                .where(eq(messagesTable.id, messageId));

                if (!message.question) throw new Error ('No present question');

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
                .returning();

                return c.json({ message: updatedMessage });
            }
            catch (error) {
                console.error(error);
                return c.json({ message: null });
            }
        }
    )

export default app;