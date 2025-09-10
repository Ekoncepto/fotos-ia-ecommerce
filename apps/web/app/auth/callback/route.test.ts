import { GET } from './route';
import { NextResponse } from 'next/server';
import { vi } from 'vitest';
import { INITIAL_CREDITS } from 'config/credits';

// Create stable mock functions
const mockUpsert = vi.fn();
const mockFrom = vi.fn(() => ({ upsert: mockUpsert }));
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
    mockUpsert.mockResolvedValue({ error: null });

    const request = new Request(`${origin}/auth/callback?code=test-code`);
    await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('test-code');
    expect(mockFrom).toHaveBeenCalledWith('user_credits');
    expect(mockUpsert).toHaveBeenCalledWith(
      [{ user_id: 'user-123', amount: INITIAL_CREDITS }],
      { onConflict: 'user_id' }
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

  it('should redirect to credit allocation error page if upsert fails', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockUpsert.mockResolvedValue({ error: new Error('Upsert error') });

    const request = new Request(`${origin}/auth/callback?code=test-code`);
    await GET(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/auth/credit-allocation-error`);
  });
});
