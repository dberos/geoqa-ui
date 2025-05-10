import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import test from '../test';
import auth from '../auth';
import chats from '../chats';
import messages from '../messages';

const app = new Hono().basePath('/api')
    .route('/auth', auth)
    .route('/chats', chats)
    .route('/messages', messages)
    .route('/test', test)

export const GET = handle(app);
export const POST = handle(app);
export const OPTIONS = handle(app);

export type AppType = typeof app;