import { render, screen } from '@testing-library/react';
import Home from './page';
import { describe, it, expect, vi } from 'vitest';

// Mock the ImageUploadForm component as its testing is separate
vi.mock('@/components/ui/image-upload-form', () => ({
  ImageUploadForm: () => <div data-testid="mock-image-upload-form"></div>,
}));

describe('Home Page', () => {
  it('should render the main heading and the image upload form', () => {
    render(<Home />);

    // Check for the main heading
    expect(screen.getByText('Fotos IA E-commerce')).toBeInTheDocument();

    // Check that the mocked form component is rendered
    expect(screen.getByTestId('mock-image-upload-form')).toBeInTheDocument();
  });
});
