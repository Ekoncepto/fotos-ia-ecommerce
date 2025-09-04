import { GET } from './route';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { vi } from 'vitest';

// Create stable mock functions
const mockInsert = vi.fn();
const mockFrom = vi.fn(() => ({ insert: mockInsert }));
const mockExchangeCodeForSession = vi.fn();

// Mock the server-side Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
    from: mockFrom,
  })),
}));

// Mock NextResponse for redirects
vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url) => new URL(url)),
  },
}));

describe('Auth Callback Route', () => {
  const origin = 'http://localhost:3000';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should attempt to allocate credits for a new user and redirect to home', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });

    const request = new Request(`${origin}/auth/callback?code=test-code`);
    await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('test-code');
    expect(mockFrom).toHaveBeenCalledWith('user_credits');
    expect(mockInsert).toHaveBeenCalledWith(
      [{ user_id: 'user-123', amount: 100 }],
      { onConflict: 'user_id', ignoreDuplicates: true }
    );
    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/`);
  });

  it('should redirect to error page if exchangeCodeForSession fails', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: null },
      error: new Error('Auth error'),
    });

    const request = new Request(`${origin}/auth/callback?code=test-code`);
    await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('test-code');
    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/auth/auth-code-error`);
  });

  it('should redirect to credit allocation error page if insert fails', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: new Error('Insert error') });

    const request = new Request(`${origin}/auth/callback?code=test-code`);
    await GET(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/auth/credit-allocation-error`);
  });
});