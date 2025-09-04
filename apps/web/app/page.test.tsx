import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}));

describe('Home Page', () => {
  it('should render the main heading', () => {
    render(<Home />);
    expect(screen.getByText('Fotos IA E-commerce')).toBeInTheDocument();
  });
});
