import { Hono } from "hono";
import root from './root';
import user from './user';

const app = new Hono()
    .route('/', root)
    .route('/user', user)

export default app;