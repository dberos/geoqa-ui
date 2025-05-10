import { Hono } from "hono";
import root from './root';

const app = new Hono()
    .route('/', root)

export default app;