import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/resources'];
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, Next.js internals, and API requests to pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('devkit_access_token')?.value;
  const isDemo = request.cookies.get('devkit_demo_mode')?.value === 'true';
  const isAuthenticated = Boolean(token || isDemo);

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);

  // 1. If logged in and visiting /login or /signup, redirect to /dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. If not authenticated and visiting protected route, redirect to /login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
