import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import test from '../test';
import auth from '../auth';

const app = new Hono().basePath('/api')
    .route('/auth', auth)
    .route('/test', test)

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;