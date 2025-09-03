import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from './lib/firebase-admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  // If there's no session cookie and the user is trying to access a protected route,
  // redirect them to the login page.
  if (!sessionCookie) {
    if (pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  try {
    // Verify the session cookie.
    const decodedToken = await getAuth().verifySessionCookie(sessionCookie, true);
    
    // The user is authenticated.
    
    // If the user is trying to access the login/signup page, redirect to dashboard.
    if (pathname === '/' || pathname.startsWith('/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // For dashboard routes, we need to pass the ID token to server components.
    // We do this by setting a request header.
    const requestHeaders = new Headers(request.headers);
    // Re-using the session cookie as the token for server-side verification
    requestHeaders.set('Authorization', `Bearer ${sessionCookie}`);
    
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

  } catch (error) {
    // Session cookie is invalid. Clear it and redirect to login.
    console.error('Middleware auth error:', error);
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('session');
    return response;
  }
}

// Define the routes that the middleware should run on.
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
