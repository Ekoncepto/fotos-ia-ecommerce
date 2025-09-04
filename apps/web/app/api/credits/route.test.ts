import { GET } from './route';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Mock the server-side Supabase client
vi.mock('@/lib/supabase/server', () => {
  const mockAuth = {
    getUser: vi.fn(),
  };
  const mockFrom = vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
  }));

  return {
    createClient: vi.fn(() => ({
      auth: mockAuth,
      from: mockFrom,
    })),
  };
});

// Mock NextResponse for json responses
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, options) => ({ data, options })),
  },
}));

describe('Credits API Route', () => {
  const mockCreateClient = createClient as vi.Mock;
  const mockGetUser = mockCreateClient().auth.getUser as vi.Mock;
  const mockFrom = mockCreateClient().from as vi.Mock;
  const mockSelect = mockFrom().select as vi.Mock;
  const mockEq = mockSelect().eq as vi.Mock;
  const mockSingle = mockEq().single as vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return credit balance for an authenticated user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } });
    mockSingle.mockResolvedValueOnce({ data: { amount: 50 }, error: null });

    const request = new Request('http://localhost:3000/api/credits', { method: 'GET' });
    const response = await GET(request);

    expect(mockGetUser).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('user_credits');
    expect(mockSelect).toHaveBeenCalledWith('amount');
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockSingle).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ amount: 50 }, { status: 200 });
    expect(response.data).toEqual({ amount: 50 });
    expect(response.options.status).toBe(200);
  });

  it('should return 0 credits if user has no entry', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } });
    mockSingle.mockResolvedValueOnce({ data: null, error: null }); // No data found

    const request = new Request('http://localhost:3000/api/credits', { method: 'GET' });
    const response = await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ amount: 0 }, { status: 200 });
    expect(response.data).toEqual({ amount: 0 });
    expect(response.options.status).toBe(200);
  });

  it('should return 401 if user is unauthorized', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const request = new Request('http://localhost:3000/api/credits', { method: 'GET' });
    const response = await GET(request);

    expect(mockGetUser).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, { status: 401 });
    expect(response.data).toEqual({ error: 'Unauthorized' });
    expect(response.options.status).toBe(401);
  });

  it('should return 500 if fetching credits fails', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } });
    mockSingle.mockResolvedValueOnce({ data: null, error: new Error('Database error') });

    const request = new Request('http://localhost:3000/api/credits', { method: 'GET' });
    const response = await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch credit balance' }, { status: 500 });
    expect(response.data).toEqual({ error: 'Failed to fetch credit balance' });
    expect(response.options.status).toBe(500);
  });
});
