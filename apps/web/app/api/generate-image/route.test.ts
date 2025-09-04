import { POST } from './route';
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
    update: vi.fn(() => ({
      eq: vi.fn(),
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

describe('Generate Image API Route', () => {
  const mockCreateClient = createClient as vi.Mock;
  const mockGetUser = mockCreateClient().auth.getUser as vi.Mock;
  const mockFrom = mockCreateClient().from as vi.Mock;
  const mockSelect = mockFrom().select as vi.Mock;
  const mockEqSelect = mockSelect().eq as vi.Mock;
  const mockSingle = mockEqSelect().single as vi.Mock;
  const mockUpdate = mockFrom().update as vi.Mock;
  const mockEqUpdate = mockUpdate().eq as vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should deduct credits and return success for sufficient credits', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } });
    mockSingle.mockResolvedValueOnce({ data: { amount: 50 }, error: null }); // User has 50 credits
    mockEqUpdate.mockResolvedValueOnce({ error: null }); // Update successful

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    const response = await POST(request);

    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSingle).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledWith({ amount: 40 }); // 50 - 10 = 40
    expect(mockEqUpdate).toHaveBeenCalledWith('user_id', 'user-123');
    expect(NextResponse.json).toHaveBeenCalledWith({ message: 'Image generation successful', remainingCredits: 40 }, { status: 200 });
    expect(response.data).toEqual({ message: 'Image generation successful', remainingCredits: 40 });
    expect(response.options.status).toBe(200);
  });

  it('should return 403 for insufficient credits', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } });
    mockSingle.mockResolvedValueOnce({ data: { amount: 5 }, error: null }); // User has 5 credits

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    const response = await POST(request);

    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSingle).toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled(); // Should not deduct credits
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Insufficient credits' }, { status: 403 });
    expect(response.data).toEqual({ error: 'Insufficient credits' });
    expect(response.options.status).toBe(403);
  });

  it('should return 401 if user is unauthorized', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    const response = await POST(request);

    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSingle).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, { status: 401 });
    expect(response.data).toEqual({ error: 'Unauthorized' });
    expect(response.options.status).toBe(401);
  });

  it('should return 500 if fetching credits fails', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } });
    mockSingle.mockResolvedValueOnce({ data: null, error: new Error('Database error') });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    const response = await POST(request);

    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSingle).toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch credit balance' }, { status: 500 });
    expect(response.data).toEqual({ error: 'Failed to fetch credit balance' });
    expect(response.options.status).toBe(500);
  });

  it('should return 500 if deducting credits fails', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: 'user-123' } } });
    mockSingle.mockResolvedValueOnce({ data: { amount: 50 }, error: null });
    mockEqUpdate.mockResolvedValueOnce({ error: new Error('Update error') });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    const response = await POST(request);

    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSingle).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Failed to deduct credits' }, { status: 500 });
    expect(response.data).toEqual({ error: 'Failed to deduct credits' });
    expect(response.options.status).toBe(500);
  });
});
