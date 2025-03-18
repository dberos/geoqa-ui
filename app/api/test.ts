import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { createJWT } from "@/lib/session";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { helloSchema, loginSchema } from "@/schemas";

// Rename file to index.ts to have root route
// Create more files in this folder to have nested routes

const app = new Hono()
    .post(
        '/login', 
        zValidator("json", loginSchema), 
        async (c) => {
            try {
                const { email, password } = c.req.valid("json");

                const [newUser] = await db
                .insert(usersTable)
                .values({ email, password })
                .returning();
                console.log(newUser);

                const accessToken = await createJWT(email, '10s') || "";
                const refreshToken = await createJWT(email, '1h') || "";

                setCookie(c, 'accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24,
                    path: '/',
                });

                setCookie(c, 'refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24,
                    path: '/',
                });


                return c.json({
                    email,
                    password
                })


            }
            catch (error) {
                console.error(error);
                return c.json({ error: "Error" }, { status: 500 });
            }
            
    })
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
    .get('/hello', (c) => {
        return c.json({ message: "Hello World" });
    })
    .post(
        '/hello', 
        zValidator("json", helloSchema), 
        async (c) => {
            try {
                const { message } = c.req.valid("json");
                return c.json({ message })


            }
            catch (error) {
                console.error(error);
                return c.json({ error: "Error" }, { status: 500 });
            }
            
    })


export default app;