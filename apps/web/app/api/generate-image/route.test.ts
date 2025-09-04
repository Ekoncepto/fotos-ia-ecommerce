import { POST } from './route';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { vi } from 'vitest';

// Create stable mock functions
const mockSingle = vi.fn();
const mockEqForSelect = vi.fn(() => ({ single: mockSingle }));
const mockSelect = vi.fn(() => ({ eq: mockEqForSelect }));

const mockEqForUpdate = vi.fn();
const mockUpdate = vi.fn(() => ({ eq: mockEqForUpdate }));

const mockFrom = vi.fn(() => ({ select: mockSelect, update: mockUpdate }));
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

describe('Generate Image API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should deduct credits and return success for sufficient credits', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockSingle.mockResolvedValue({ data: { amount: 50 }, error: null });
    mockEqForUpdate.mockResolvedValue({ error: null });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    await POST(request);

    expect(mockUpdate).toHaveBeenCalledWith({ amount: 40 });
    expect(mockEqForUpdate).toHaveBeenCalledWith('user_id', 'user-123');
    expect(NextResponse.json).toHaveBeenCalledWith({ message: 'Image generation successful', remainingCredits: 40 }, { status: 200 });
  });

  it('should return 403 for insufficient credits', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockSingle.mockResolvedValue({ data: { amount: 5 }, error: null });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    await POST(request);

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Insufficient credits' }, { status: 403 });
  });

  it('should return 401 if user is unauthorized', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, { status: 401 });
  });

  it('should return 500 if fetching credits fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockSingle.mockResolvedValue({ data: null, error: new Error('Database error') });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch credit balance' }, { status: 500 });
  });

  it('should return 500 if deducting credits fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockSingle.mockResolvedValue({ data: { amount: 50 }, error: null });
    mockEqForUpdate.mockResolvedValue({ error: new Error('Update error') });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Failed to deduct credits' }, { status: 500 });
  });
});
