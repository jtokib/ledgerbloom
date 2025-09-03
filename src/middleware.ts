
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force the middleware to run on the Node.js runtime.
// This is required for dependencies that use Node.js APIs.
export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const isDashboardPath = pathname.startsWith('/dashboard');
  const isAuthPath = pathname === '/' || pathname.startsWith('/signup');

  // If trying to access a protected dashboard page without a session, redirect to login.
  if (!sessionCookie && isDashboardPath) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If the user has a session and tries to access login or signup, redirect to the dashboard.
  if (sessionCookie && isAuthPath) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // For dashboard routes, pass the session cookie in the Authorization header.
  // This allows server components and API routes to verify it.
  if (isDashboardPath) {
    const requestHeaders = new Headers(request.headers);
    if (sessionCookie) {
      requestHeaders.set('Authorization', `Bearer ${sessionCookie}`);
    }
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware should run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
