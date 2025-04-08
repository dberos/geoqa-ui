import { db } from "@/db";
import { sessionsTable, tokensTable } from "@/db/schema";
import { verifyJWT } from "@/lib/session";
import { RefreshSchema } from "@/schemas";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono()
    .post(
        '/',
        zValidator("json", RefreshSchema),
        async (c) => {
            try {
                const { 
                    sessionId,
                    oldJti,
                    jti,
                    exp
                } = c.req.valid("json");

                // Validate the refresh token and check if user is authorized to perform this
                const authHeader = c.req.header('Authorization');
                
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    return c.json({ success: false }, { status: 401 });
                }

                // Extract the token from the Authorization header
                const refreshToken = authHeader.split(' ')[1];
                const verifiedRefreshToken = await verifyJWT(refreshToken);
                if (!verifiedRefreshToken) {
                    return c.json({ success: false }, { status: 500 });
                }

                const rtJti = verifiedRefreshToken?.jti || "";
                const rtSessionId = verifiedRefreshToken?.sessionId || "";
                
                if (rtJti !== oldJti || rtSessionId !== sessionId) {
                    return c.json({ success: false }, { status: 500 });
                }
                
                // Check if session exists
                const [session] = await db
                .select()
                .from(sessionsTable)
                .where(eq(sessionsTable.id, sessionId))
                .limit(1);
    
                if (!session) {
                    // If no present session, then something's wrong
                    return c.json({ success: false }, { status: 500 });
                }
                else {
                    // Check if token is blacklisted
                    const [token] = await db
                    .select()
                    .from(tokensTable)
                    .where(eq(tokensTable.jti, oldJti))
                    .limit(1);
                    if (token?.isBlacklisted) {
                        // If it is blacklisted delete the session
                        await db
                        .delete(sessionsTable)
                        .where(eq(sessionsTable.id, sessionId));
                        return c.json({ success: false }, { status: 500 });
                    }
                    else {
                        // Blacklist it and insert the new token with blacklist false
                        await db
                        .update(tokensTable)
                        .set({ isBlacklisted: true })
                        .where(eq(tokensTable.jti, oldJti))
    
                        await db
                        .insert(tokensTable)
                        .values({
                            sessionId,
                            jti,
                            exp,
                        });
                        return c.json({ success: true });
                    }
                }
            }
            catch (error) {
                console.error(error);
                return c.json({ success: false }, { status: 500 });
            }
        }
    )

export default app;