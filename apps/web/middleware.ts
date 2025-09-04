import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for demonstration purposes
const ipCache = new Map<string, number[]>();
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';

  // Clean up old requests
  const now = Date.now();
  const requests = ipCache.get(ip) || [];
  const recentRequests = requests.filter(timestamp => now - timestamp < WINDOW_SIZE_MS);
  ipCache.set(ip, recentRequests);

  if (recentRequests.length >= MAX_REQUESTS) {
    return new NextResponse('Too many requests', { status: 429 });
  }

  recentRequests.push(now);
  ipCache.set(ip, recentRequests);

  return NextResponse.next();
}

export const config = {
  matcher: '/api/auth/:path*',
};
