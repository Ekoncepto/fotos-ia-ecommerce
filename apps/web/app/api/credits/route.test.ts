import { GET } from './route';
import { NextResponse } from 'next/server';
import { vi } from 'vitest';

// Create stable mock functions
const mockSingle = vi.fn();
const mockEq = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEq }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockGetUser = vi.fn();

// Mock the server-side Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

// Mock NextResponse for json responses
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, options) => ({ data, options })),
  },
}));

describe('Credits API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return credit balance for an authenticated user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    mockSingle.mockResolvedValue({ data: { amount: 50 }, error: null });

    const request = new Request('http://localhost:3000/api/credits');
    await GET(request);

    expect(mockGetUser).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalledWith('user_credits');
    expect(mockSelect).toHaveBeenCalledWith('amount');
    expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockSingle).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ amount: 50 }, { status: 200 });
  });

  it('should return 0 credits if user has no entry', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    mockSingle.mockResolvedValue({ data: null, error: null }); // No data found

    const request = new Request('http://localhost:3000/api/credits');
    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ amount: 0 }, { status: 200 });
  });

  it('should return 401 if user is unauthorized', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const request = new Request('http://localhost:3000/api/credits');
    await GET(request);

    expect(mockGetUser).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, { status: 401 });
  });

  it('should return 500 if fetching credits fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    mockSingle.mockResolvedValue({ data: null, error: new Error('Database error') });

    const request = new Request('http://localhost:3000/api/credits');
    await GET(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch credit balance' }, { status: 500 });
  });
});
