import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './page';

describe('Home Page', () => {
  it('should render the main heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /Fotos IA E-commerce/i
    });

    expect(heading).toBeInTheDocument();
  });
});
