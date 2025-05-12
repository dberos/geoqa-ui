import { Hono } from "hono";
import root from './root';
import chat from './chat';

const app = new Hono()
    .route('/', root)
    .route('/chat', chat)

export default app;