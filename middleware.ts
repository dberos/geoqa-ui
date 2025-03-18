import { Middleware } from './lib/middleware';

export default Middleware();
  
export const config = {
    matcher: [
      '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
  }