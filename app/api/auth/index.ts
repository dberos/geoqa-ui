import { Hono } from "hono";
import github from './github';

const app = new Hono()
    .route('/github', github)

export default app;