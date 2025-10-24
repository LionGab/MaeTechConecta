import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for server-side route protection
 * Redirects unauthenticated users to login page
 */
export function middleware(request: NextRequest) {
  // Check for Firebase auth token in cookies
  const authToken = request.cookies.get('__session');
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!authToken) {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: ['/dashboard/:path*'],
};
