import { GET } from './route';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Mock the server-side Supabase client
vi.mock('@/lib/supabase/server', () => {
  const mockAuth = {
    exchangeCodeForSession: vi.fn(),
    getUser: vi.fn(),
  };
  const mockFrom = vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
    insert: vi.fn(),
  }));

  return {
    createClient: vi.fn(() => ({
      auth: mockAuth,
      from: mockFrom,
    })),
  };
});

// Mock NextResponse for redirects
vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url) => new URL(url)),
    json: vi.fn((data, options) => ({ data, options })),
  },
}));

describe('Auth Callback Route', () => {
  const mockCreateClient = createClient as vi.Mock;
  const mockExchangeCodeForSession = mockCreateClient().auth.exchangeCodeForSession as vi.Mock;
  const mockFrom = mockCreateClient().from as vi.Mock;
  const mockInsert = mockFrom().insert as vi.Mock;
  const mockSelect = mockFrom().select as vi.Mock;
  const mockEq = mockSelect().eq as vi.Mock;
  const mockSingle = mockEq().single as vi.Mock;

  const origin = 'http://localhost:3000';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allocate credits for a new user', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } }); // No rows found
    mockInsert.mockResolvedValueOnce({ error: null });

    const request = new Request(`${origin}/auth/callback?code=test-code`, { method: 'GET' });
    const response = await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('test-code');
    expect(mockFrom).toHaveBeenCalledWith('user_credits');
    expect(mockInsert).toHaveBeenCalledWith([{ user_id: 'user-123', amount: 100 }]);
    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/`);
    expect(response.toString()).toBe(`${origin}/`);
  });

  it('should not re-allocate credits for an existing user', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockSingle.mockResolvedValueOnce({ data: { id: 'credit-id' }, error: null }); // Credits already exist

    const request = new Request(`${origin}/auth/callback?code=test-code`, { method: 'GET' });
    const response = await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('test-code');
    expect(mockFrom).toHaveBeenCalledWith('user_credits');
    expect(mockInsert).not.toHaveBeenCalled(); // Should not insert
    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/`);
    expect(response.toString()).toBe(`${origin}/`);
  });

  it('should redirect to error page if exchangeCodeForSession fails', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({
      data: { user: null },
      error: new Error('Auth error'),
    });

    const request = new Request(`${origin}/auth/callback?code=test-code`, { method: 'GET' });
    const response = await GET(request);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('test-code');
    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/auth/auth-code-error`);
    expect(response.toString()).toBe(`${origin}/auth/auth-code-error`);
  });

  it('should redirect to credit allocation error page if insert fails', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
    mockInsert.mockResolvedValueOnce({ error: new Error('Insert error') });

    const request = new Request(`${origin}/auth/callback?code=test-code`, { method: 'GET' });
    const response = await GET(request);

    expect(mockInsert).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/auth/credit-allocation-error`);
    expect(response.toString()).toBe(`${origin}/auth/credit-allocation-error`);
  });

  it('should redirect to credit check error page if fetching existing credits fails (not PGRST116)', async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({
      data: { user: { id: 'user-123' } },
      error: null,
    });
    mockSingle.mockResolvedValueOnce({ data: null, error: new Error('Fetch error') }); // General fetch error

    const request = new Request(`${origin}/auth/callback?code=test-code`, { method: 'GET' });
    const response = await GET(request);

    expect(mockSingle).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/auth/credit-check-error`);
    expect(response.toString()).toBe(`${origin}/auth/credit-check-error`);
  });
});