import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decode } from 'jsonwebtoken';

// Define protected routes
const protectedRoutes = ['/upload'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if(token && pathname==='/upload'){
    const decoded: any = decode(token);
    if (decoded?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/not-authorized', request.url));
    }
  }
  }
  

// Apply middleware to all routes or limit scope using matcher
export const config = {
  matcher: ['/upload/:path*'],
};
