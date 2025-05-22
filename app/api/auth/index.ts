import { Hono } from "hono";
import root from './root';
import github from './github';
import google from './google';
import refresh from './refresh';
import signIn from './sign-in';
import signOut from './sign-out';
import legal from './legal';

const app = new Hono()
    .route('/', root)
    .route('/github', github)
    .route('/google', google)
    .route('/refresh', refresh)
    .route('/sign-in', signIn)
    .route('/sign-out', signOut)
    .route('/legal', legal)

export default app;