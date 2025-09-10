import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'

// In-memory rate limiter (kept from previous implementation)
const ipCache = new Map<string, number[]>()
const WINDOW_SIZE_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5 // 5 requests per minute

function applyRateLimitingIfAuthApi(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (!pathname.startsWith('/api/auth/')) return null

  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const now = Date.now()
  const requests = ipCache.get(ip) || []
  const recentRequests = requests.filter((timestamp) => now - timestamp < WINDOW_SIZE_MS)
  ipCache.set(ip, recentRequests)

  if (recentRequests.length >= MAX_REQUESTS) {
    return new NextResponse('Too many requests', { status: 429 })
  }

  recentRequests.push(now)
  ipCache.set(ip, recentRequests)

  return null
}

export async function middleware(request: NextRequest) {
  // 1) Preserve existing rate limiter for auth API endpoints
  const rateLimitResponse = applyRateLimitingIfAuthApi(request)
  if (rateLimitResponse) return rateLimitResponse

  const { pathname } = request.nextUrl

  // 2) Prepare a response that allows Supabase to set cookies during session refresh
  const response = NextResponse.next({ request: { headers: request.headers } })

  // 3) Create Supabase client bound to middleware req/res and refresh session
  const supabase = createMiddlewareClient(request, response)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes
  const isAuthRoute = pathname.startsWith('/auth/')
  const isLoginRoute = pathname === '/login'

  // 4) Redirect authenticated users away from /login
  if (isLoginRoute && user) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  // 5) Allow public routes without auth
  if (isLoginRoute || isAuthRoute) {
    return response
  }

  // 6) Protect all other routes: redirect unauthenticated users to /login
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  // Avoid static assets and files with extensions, but include app routes, /login, /auth/* and /api/auth/* (for rate limiter)
  matcher: [
    '/((?!_next|.*\\..*|favicon.ico|robots.txt|sitemap.xml).*)',
    '/api/auth/:path*',
  ],
}
