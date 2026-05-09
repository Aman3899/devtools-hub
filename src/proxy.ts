import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const middleware = createMiddleware(routing);

export default function (request: NextRequest) {
  console.log('Proxy/Middleware matching URL:', request.nextUrl.pathname);
  return middleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ur|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
