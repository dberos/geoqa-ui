import { userMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";

const app = new Hono()
    .get('/', userMiddleware, (c) => {
        const session = c.get('session');
        return session ? c.json({ session }) : c.json({ session: null });
    })

export default app;