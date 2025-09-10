import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase middleware client
const getUserMock = vi.fn()
vi.mock('@/lib/supabase/middleware', () => ({
  createMiddlewareClient: vi.fn(() => ({
    auth: { getUser: getUserMock },
  })),
}))

// Mock next/server - provide constructor and static methods used
vi.mock('next/server', async () => {
  const redirect = vi.fn((url: string) => ({ url, status: 307, cookies: { set: vi.fn() } }))
  const next = vi.fn(() => ({ cookies: { set: vi.fn() } }))
  function MockNextResponse(this: any, body?: any, init?: any) {
    return { body, status: init?.status ?? 200, cookies: { set: vi.fn() } }
  }
  ;(MockNextResponse as any).redirect = redirect
  ;(MockNextResponse as any).next = next
  return { NextResponse: MockNextResponse }
})

// Import after mocks
import { NextResponse } from 'next/server'
import { middleware } from './middleware'

function makeReq(path: string, ip = '127.0.0.1'): any {
  const url = `http://localhost:3000${path}`
  return {
    nextUrl: new URL(url),
    url,
    headers: new Headers(),
    cookies: { get: vi.fn() },
    ip,
  }
}

describe('middleware auth redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects unauthenticated users on protected route to /login', async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null } })
    const res: any = await middleware(makeReq('/dashboard'))
    const redirect = (NextResponse as any).redirect
    expect(redirect).toHaveBeenCalled()
    const target = (redirect.mock.calls[0] as any)[0]
    expect(String(target)).toContain('/login')
    expect(res.status).toBe(307)
  })

  it('redirects authenticated users away from /login to /', async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: 'u1' } } })
    const res: any = await middleware(makeReq('/login'))
    const redirect = (NextResponse as any).redirect
    expect(redirect).toHaveBeenCalled()
    const target = (redirect.mock.calls[0] as any)[0]
    expect(String(target)).toContain('/')
    expect(String(target)).not.toContain('/login')
    expect(res.status).toBe(307)
  })
})

describe('middleware rate limiting for /api/auth/*', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // For rate limiting path, auth path short-circuits before getUser; ensure no throw
    getUserMock.mockResolvedValue({ data: { user: null } })
  })

  it('returns 429 after exceeding limit', async () => {
    let last: any
    for (let i = 0; i < 6; i++) {
      last = await middleware(makeReq('/api/auth/test', '9.9.9.9'))
    }
    expect(last.status).toBe(429)
  })
})
