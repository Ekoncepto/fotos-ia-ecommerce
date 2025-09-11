import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ImageUploadForm } from './image-upload-form';

// Mock the supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      }),
    },
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [{ id: 'new-product-id' }], error: null }),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  }),
}));

// Mock DOMPurify
vi.mock('dompurify', () => ({
  sanitize: (input: string) => input,
}));

describe('ImageUploadForm', () => {
  beforeEach(() => {
    // Mock the global fetch function
    global.fetch = vi.fn((url) => {
      if (url === '/api/credits') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ amount: 100 }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response);
    }) as vi.Mock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the form with all fields and credit info', async () => {
    render(<ImageUploadForm />);
    expect(screen.getByLabelText(/Nome do Produto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Imagens de Referência/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Gerar Fotos/i })).toBeInTheDocument();

    // Wait for the async credit fetch to complete
    expect(await screen.findByText(/Créditos disponíveis: 100/i)).toBeInTheDocument();
  });

  it('should have the submit button disabled initially', async () => {
    render(<ImageUploadForm />);
    // Wait for credits to load, button should still be disabled as form is empty
    await screen.findByText(/Créditos disponíveis: 100/i);
    expect(screen.getByRole('button', { name: /Gerar Fotos/i })).toBeDisabled();
  });

  it('should enable the submit button when all fields are filled and credits are sufficient', async () => {
    render(<ImageUploadForm />);
    const nameInput = screen.getByLabelText(/Nome do Produto/i);
    const categoryInput = screen.getByLabelText(/Categoria/i);
    const fileInput = screen.getByLabelText(/Imagens de Referência/i);
    const submitButton = screen.getByRole('button', { name: /Gerar Fotos/i });

    // Wait for credits to load
    await screen.findByText(/Créditos disponíveis: 100/i);
    expect(submitButton).toBeDisabled();

    // Fill the form
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(categoryInput, { target: { value: 'Test Category' } });
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wait for the button to be enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should display helpful upload tips without affecting inputs', async () => {
    render(<ImageUploadForm />);
    // Tips are visible and accessible
    expect(await screen.findByLabelText(/Dicas de Foto/i)).toBeInTheDocument();
    expect(screen.getByText(/boa iluminação/i)).toBeInTheDocument();

    // Inputs continue to work normally
    const nameInput = screen.getByLabelText(/Nome do Produto/i);
    const categoryInput = screen.getByLabelText(/Categoria/i);
    const fileInput = screen.getByLabelText(/Imagens de Referência/i);

    // Fill values to ensure no interference
    fireEvent.change(nameInput, { target: { value: 'Produto X' } });
    fireEvent.change(categoryInput, { target: { value: 'Categoria Y' } });
    const file = new File(['abc'], 'a.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(nameInput).toHaveValue('Produto X');
    expect(categoryInput).toHaveValue('Categoria Y');
    expect((fileInput as HTMLInputElement).files?.length).toBe(1);
  });
  it('should disable the button if credits are insufficient', async () => {
     // Override fetch mock for this specific test
     global.fetch = vi.fn((url) => {
        if (url === '/api/credits') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ amount: 0 }),
          });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response);
      }) as vi.Mock;

    render(<ImageUploadForm />);
    await screen.findByText(/Créditos disponíveis: 0/i);

    const nameInput = screen.getByLabelText(/Nome do Produto/i);
    const categoryInput = screen.getByLabelText(/Categoria/i);
    const fileInput = screen.getByLabelText(/Imagens de Referência/i);
    const submitButton = screen.getByRole('button', { name: /Gerar Fotos/i });

    // Fill the form
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(categoryInput, { target: { value: 'Test Category' } });
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(submitButton).toBeDisabled();
    expect(await screen.findByText(/Você não tem créditos suficientes para gerar imagens./i)).toBeInTheDocument();
  });
});
