import { Hono } from "hono";
import { sessionMiddleware } from "@/lib/session-middleware";

// Rename file to index.ts to have root route
// Create more files in this folder to have nested routes

const app = new Hono()
    .get('/gis', async (c) => {
        const response = await fetch(process.env.NLQ_API_URL!, {
            method: 'POST',
            headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            },    
            body: new URLSearchParams({
                question: 'complete-test'
            })
        });
        const result = await response.json();
        return c.json({ answer: result });
    })
    .get('/', sessionMiddleware, async (c) => {
        const session = c.get('session');
        return c.json({ session });
    })


export default app;