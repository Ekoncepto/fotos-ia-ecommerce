import { render, screen } from '@testing-library/react';
import Home from './page';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}));

describe('Home Page', () => {
  beforeEach(() => {
    // Mock fetch for the ImageGenerator component
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ amount: 100 }),
      })
    ) as any;
  });

  it('should render the main heading', async () => {
    render(<Home />);
    expect(screen.getByText('Fotos IA E-commerce')).toBeInTheDocument();
    // Also wait for the async part of ImageGenerator to complete
    await screen.findByText('Créditos disponíveis: 100');
  });
});
