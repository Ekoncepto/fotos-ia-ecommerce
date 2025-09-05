import { render, screen } from '@testing-library/react';
import Home from './page';
import { describe, it, expect, vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}));

// Mock the ImageUploadForm component
vi.mock('@/components/ui/image-upload-form', () => ({
  ImageUploadForm: () => <div data-testid="mock-image-upload-form"></div>,
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

  it('should render the main heading and credits', async () => {
    render(<Home />);
    expect(screen.getByText('Fotos IA E-commerce')).toBeInTheDocument();
    // Also wait for the async part of ImageGenerator to complete
    await screen.findByText('Créditos disponíveis: 100');
  });

  it('should render the page with the mocked form', () => {
    render(<Home />);

    // Check that the mocked component is rendered
    const mockForm = screen.getByTestId('mock-image-upload-form');
    expect(mockForm).toBeInTheDocument();
  });
});
