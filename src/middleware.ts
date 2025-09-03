
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force the middleware to run on the Node.js runtime.
// This is required because 'firebase-admin' and its dependencies need Node.js APIs.
export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Redirect to login if trying to access dashboard without a session
  if (!sessionCookie && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if logged in and trying to access login page
  if (sessionCookie && (pathname === '/' || pathname.startsWith('/signup'))) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // For dashboard routes, pass the session cookie in the Authorization header.
  // This allows server components to verify it.
  if (pathname.startsWith('/dashboard')) {
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
