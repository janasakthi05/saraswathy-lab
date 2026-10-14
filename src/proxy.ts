import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from './lib/session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all admin pages except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const authSecret = process.env.AUTH_SECRET || 'local_secure_dev_auth_secret_token_184920';

    let isAuthorized = false;
    if (sessionCookie) {
      const verified = await verifySession(sessionCookie, authSecret);
      if (verified) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect all admin APIs
  if (pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const authSecret = process.env.AUTH_SECRET || 'local_secure_dev_auth_secret_token_184920';

    let isAuthorized = false;
    if (sessionCookie) {
      const verified = await verifySession(sessionCookie, authSecret);
      if (verified) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized administrative session.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
