import { Hono } from "hono";
import root from './root';
import chat from './chat';
import message from './message';

const app = new Hono()
    .route('/', root)
    .route('/chat', chat)
    .route('/message', message)

export default app;