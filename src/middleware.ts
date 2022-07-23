import { verifyJwt } from '@/utils/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('token')
  const token = tokenCookie ? tokenCookie.value : ''

  const isLoginPage = request.nextUrl.pathname.startsWith('/auth/login')

  let payload
  try {
    payload = await verifyJwt(token)
  } catch (e) {}

  if (!payload) return NextResponse.redirect(new URL('/auth/login', request.url))

  if (isLoginPage) return NextResponse.redirect(new URL('/', request.url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/users/:path*', '/posts/:path*'],
}
