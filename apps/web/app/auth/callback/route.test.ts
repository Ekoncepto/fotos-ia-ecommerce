import { GET } from './route';
import { vi } from 'vitest';
import { NextResponse } from 'next/server';

describe('Auth Callback Route', () => {
  beforeEach(() => {
    vi.resetModules(); // Reset modules before each test
  });

  it('should exchange code for session and redirect to / if successful', async () => {
    // Mock the server-side Supabase client for this test
    vi.doMock('@/lib/supabase/server', () => ({
      createClient: vi.fn(() => ({
        auth: {
          exchangeCodeForSession: vi.fn(() => ({
            error: null,
          })),
        },
      })),
    }));

    const { GET } = await import('./route'); // Re-import GET after mocking

    const request = new Request('http://localhost/auth/callback?code=test-code', {
      method: 'GET',
    });

    const response = await GET(request);

    expect(response.status).toBe(307); // Temporary Redirect
    expect(response.headers.get('Location')).toBe('http://localhost/');
  });

  it('should redirect to /auth/auth-code-error if code exchange fails', async () => {
    // Mock the createClient to return an error for this test
    vi.doMock('@/lib/supabase/server', () => ({
      createClient: vi.fn(() => ({
        auth: {
          exchangeCodeForSession: vi.fn(() => ({
            error: new Error('Exchange failed'),
          })),
        },
      })),
    }));

    const { GET } = await import('./route'); // Re-import GET after mocking

    const request = new Request('http://localhost/auth/callback?code=test-code', {
      method: 'GET',
    });

    const response = await GET(request);

    expect(response.status).toBe(307); // Temporary Redirect
    expect(response.headers.get('Location')).toBe('http://localhost/auth/auth-code-error');
  });
});
