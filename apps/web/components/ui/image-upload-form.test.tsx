import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImageUploadForm } from './image-upload-form';

// Mock the supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      }),
    },
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'http://example.com/test.png' } }),
    },
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
  }),
}));

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

describe('ImageUploadForm', () => {
  it('should render the form with all fields', () => {
    render(<ImageUploadForm />);
    expect(screen.getByLabelText(/Nome do Produto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Imagens de Referência/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Gerar Fotos/i })).toBeInTheDocument();
  });

  it('should have the submit button disabled initially', () => {
    render(<ImageUploadForm />);
    expect(screen.getByRole('button', { name: /Gerar Fotos/i })).toBeDisabled();
  });

  it('should enable the submit button when all fields are filled', async () => {
    render(<ImageUploadForm />);

    const nameInput = screen.getByLabelText(/Nome do Produto/i);
    const categoryInput = screen.getByLabelText(/Categoria/i);
    const fileInput = screen.getByLabelText(/Imagens de Referência/i);
    const submitButton = screen.getByRole('button', { name: /Gerar Fotos/i });

    expect(submitButton).toBeDisabled();

    await fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    await fireEvent.change(categoryInput, { target: { value: 'Test Category' } });

    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    await fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(submitButton).not.toBeDisabled();
  });

  it('should disable the button if any field is cleared', async () => {
    render(<ImageUploadForm />);

    const nameInput = screen.getByLabelText(/Nome do Produto/i);
    const categoryInput = screen.getByLabelText(/Categoria/i);
    const fileInput = screen.getByLabelText(/Imagens de Referência/i);
    const submitButton = screen.getByRole('button', { name: /Gerar Fotos/i });

    // Fill all fields
    await fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    await fireEvent.change(categoryInput, { target: { value: 'Test Category' } });
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    await fireEvent.change(fileInput, { target: { files: [file] } });

    expect(submitButton).not.toBeDisabled();

    // Clear one field
    await fireEvent.change(nameInput, { target: { value: '' } });

    expect(submitButton).toBeDisabled();
  });
});
