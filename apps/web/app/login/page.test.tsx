import { render, screen } from '@testing-library/react';
import LoginPage from './page';
import { vi } from 'vitest';

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: vi.fn(),
    },
  }),
}));

describe('LoginPage', () => {
  it('should render the sign in button', () => {
    render(<LoginPage />);
    const signInButton = screen.getByRole('button', { name: /sign in with google/i });
    expect(signInButton).toBeInTheDocument();
  });
});
