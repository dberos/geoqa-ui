import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/hono-middleware";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
    .get(
        '/',
        sessionMiddleware,
        async (c) => {
            try {
                const session = c.get('session');
                const userId = session?.id
                if (!session || !userId) {
                    return c.json({ error: 'Unauthorized' }, { status: 401 });
                }

                const [user] = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.id, userId));

                return c.json({ user });
            }
            catch (error) {
                console.error(error);
                return c.json({ error }, { status: 500 });
            }
        }
    )

export default app;