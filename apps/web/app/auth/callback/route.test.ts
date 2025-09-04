import { GET } from './route';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { vi } from 'vitest';

// Create stable mock functions
const mockSingle = vi.fn();
const mockInsert = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect, insert: mockInsert }));
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

  it('should allocate credits for a new user', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } }); // No rows found
    mockInsert.mockResolvedValue({ error: null });

    const request = new Request(`${origin}/auth/callback?code=test-code`);
    await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('test-code');
    expect(mockFrom).toHaveBeenCalledWith('user_credits');
    expect(mockInsert).toHaveBeenCalledWith([{ user_id: 'user-123', amount: 100 }]);
    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/`);
  });

  it('should not re-allocate credits for an existing user', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockSingle.mockResolvedValue({ data: { id: 'credit-id' }, error: null }); // Credits already exist

    const request = new Request(`${origin}/auth/callback?code=test-code`);
    await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('test-code');
    expect(mockFrom).toHaveBeenCalledWith('user_credits');
    expect(mockInsert).not.toHaveBeenCalled(); // Should not insert
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
    mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    mockInsert.mockResolvedValue({ error: new Error('Insert error') });

    const request = new Request(`${origin}/auth/callback?code=test-code`);
    await GET(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/auth/credit-allocation-error`);
  });

  it('should redirect to credit check error page if fetching existing credits fails (not PGRST116)', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockSingle.mockResolvedValue({ data: null, error: new Error('Fetch error') }); // General fetch error

    const request = new Request(`${origin}/auth/callback?code=test-code`);
    await GET(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/auth/credit-check-error`);
  });
});