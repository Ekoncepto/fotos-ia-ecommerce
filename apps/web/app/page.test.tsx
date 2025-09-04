import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './page';

// Mock the ImageUploadForm component to avoid dealing with its dependencies in this test
vi.mock('@/components/ui/image-upload-form', () => ({
  ImageUploadForm: () => <div data-testid="mock-image-upload-form"></div>,
}));

describe('Home Page', () => {
  it('should render the page with the mocked form', () => {
    render(<Home />);

    // Check that the mocked component is rendered
    const mockForm = screen.getByTestId('mock-image-upload-form');
    expect(mockForm).toBeInTheDocument();
  });
});
