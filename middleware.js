import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes unless the user has recently unlocked them with Ctrl+B
  if (pathname.startsWith('/admin')) {
    const adminAccess = request.cookies.get('admin_access')?.value;
    if (adminAccess !== '1') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
