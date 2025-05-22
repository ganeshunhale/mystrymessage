import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export { default } from 'next-auth/middleware'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  const isAuthPage =
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify')

  const isDashboard = url.pathname.startsWith('/dashboard')

  // ✅ If logged in and on auth page, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ✅ If not logged in and on protected dashboard page, redirect to login
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}
export const config = {
    matcher: [
      '/sign-in',
      '/sign-up',
      '/verify/:path*',
      '/dashboard/:path*'
    ]
  }