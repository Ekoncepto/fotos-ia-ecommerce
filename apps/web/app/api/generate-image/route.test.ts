import { POST } from './route';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { vi } from 'vitest';
import { IMAGE_GENERATION_COST } from 'config/credits';

// Create stable mock functions
const mockRpc = vi.fn();
const mockGetUser = vi.fn();
const mockFrom = vi.fn();

// Mock the server-side Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    rpc: mockRpc,
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
  const mockProductId = 'prod-456';
  const mockRequest = (body: any) => new Request('http://localhost/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for the product lookup chain
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { name: 'Test Product' }, error: null }),
    });
  });

  it('should deduct credits and return success for sufficient credits', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockRpc.mockResolvedValue({ data: 40, error: null });

    const request = mockRequest({ product_id: mockProductId });
    await POST(request);

    expect(mockRpc).toHaveBeenCalledWith('deduct_credits', {
      user_id_input: 'user-123',
      cost: IMAGE_GENERATION_COST,
    });

    expect(mockFrom).toHaveBeenCalledWith('products');

    const responsePayload = (NextResponse.json as any).mock.calls[0][0];
    expect(responsePayload.message).toBe('Image generation successful');
    expect(responsePayload.remainingCredits).toBe(40);
    expect(responsePayload.imageUrls).toHaveLength(2);
    expect(responsePayload.imageUrls[0]).toContain('Test%20Product');
  });

  it('should return 403 for insufficient credits', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockRpc.mockResolvedValue({ data: null, error: { message: 'Insufficient credits' } });

    const request = mockRequest({ product_id: mockProductId });
    await POST(request);

    expect(mockRpc).toHaveBeenCalledWith('deduct_credits', {
      user_id_input: 'user-123',
      cost: IMAGE_GENERATION_COST,
    });
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Insufficient credits' }, { status: 403 });
  });

  it('should return 401 if user is unauthorized', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const request = mockRequest({ product_id: mockProductId });
    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, { status: 401 });
  });

  it('should return 400 if product_id is missing', async () => {
    const request = mockRequest({});
    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Product ID is required' }, { status: 400 });
  });

  it('should return 500 if rpc fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });
    mockRpc.mockResolvedValue({ data: null, error: new Error('Database error') });

    const request = mockRequest({ product_id: mockProductId });
    await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Failed to deduct credits' }, { status: 500 });
  });
});
