import { Middleware } from './lib/middleware';

export default Middleware();
  
export const config = {
    matcher: [
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
        missing: [
          { type: 'header', key: 'next-router-prefetch' },
          { type: 'header', key: 'purpose', value: 'prefetch' },
        ],
      }
    ],
  }