import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";

const app = new Hono()
    .post('/', (c) => {
        deleteCookie(c, 'accessToken');
        deleteCookie(c, 'refreshToken');
        return c.json({ success: true })
    })

export default app;