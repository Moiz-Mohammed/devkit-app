import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup', '/'];
const AUTH_ROUTES   = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('devkit_access_token')?.value;

  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith('/api'));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // If logged in and hitting auth routes → redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If not logged in and hitting protected routes → redirect to login
  if (!token && !isPublic) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
