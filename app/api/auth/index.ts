import { Hono } from "hono";
import github from './github';
import google from './google';
import root from './root';
import signIn from './sign-in';
import signOut from './sign-out';

const app = new Hono()
    .route('/', root)
    .route('/github', github)
    .route('/google', google)
    .route('/sign-in', signIn)
    .route('/sign-out', signOut)

export default app;