import { Hono } from "hono";
import github from './github';
import google from './google';

const app = new Hono()
    .route('/github', github)
    .route('/google', google)

export default app;