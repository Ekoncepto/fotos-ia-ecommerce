import { POST } from './route';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { vi } from 'vitest';
import { IMAGE_GENERATION_COST } from 'config/credits';

// Create stable mock functions
const mockRpc = vi.fn();
const mockGetUser = vi.fn();

// Mock the server-side Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    rpc: mockRpc,
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
    mockRpc.mockResolvedValue({ data: 40, error: null });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    await POST(request);

    expect(mockRpc).toHaveBeenCalledWith('deduct_credits', {
      user_id_input: 'user-123',
      cost: IMAGE_GENERATION_COST,
    });
    expect(NextResponse.json).toHaveBeenCalledWith({ message: 'Image generation successful', remainingCredits: 40 }, { status: 200 });
  });

  it('should return 403 for insufficient credits', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockRpc.mockResolvedValue({ data: null, error: { message: 'Insufficient credits' } });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    await POST(request);

    expect(mockRpc).toHaveBeenCalledWith('deduct_credits', {
      user_id_input: 'user-123',
      cost: IMAGE_GENERATION_COST,
    });
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Insufficient credits' }, { status: 403 });
  });

  it('should return 401 if user is unauthorized', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, { status: 401 });
  });

  it('should return 500 if rpc fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockRpc.mockResolvedValue({ data: null, error: new Error('Database error') });

    const request = new Request('http://localhost:3000/api/generate-image', { method: 'POST' });
    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Failed to deduct credits' }, { status: 500 });
  });
});
