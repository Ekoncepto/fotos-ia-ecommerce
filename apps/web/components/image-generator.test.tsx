import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageGenerator from './image-generator';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}));

describe('ImageGenerator', () => {
  // Use a stable mock function for fetch
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Intercept global fetch
    global.fetch = mockFetch;
  });

  it('should display loading state initially', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ amount: 100 }) });
    render(<ImageGenerator />);
    expect(screen.getByText('Carregando créditos...')).toBeInTheDocument();
    // Wait for the component to finish loading
    await screen.findByText('Créditos disponíveis: 100');
  });

  it('should display credits and enable button if sufficient credits', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ amount: 100 }) });
    render(<ImageGenerator />);
    await screen.findByText('Créditos disponíveis: 100');
    expect(screen.getByRole('button', { name: 'Gerar Fotos' })).toBeEnabled();
  });

  it('should display insufficient credits message and disable button if insufficient credits', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ amount: 5 }) });
    render(<ImageGenerator />);
    await screen.findByText('Créditos disponíveis: 5');
    expect(screen.getByRole('button', { name: 'Gerar Fotos' })).toBeDisabled();
    expect(screen.getByText('Você não tem créditos suficientes para gerar imagens.')).toBeInTheDocument();
  });

  it('should deduct credits and show success message on successful generation', async () => {
    // Mock initial credit fetch
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ amount: 100 }) });
    // Mock generate image fetch
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ message: 'Image generation successful', remainingCredits: 90 }) });

    render(<ImageGenerator />);

    const button = await screen.findByRole('button', { name: 'Gerar Fotos' });
    fireEvent.click(button);

    await screen.findByText('Imagem gerada com sucesso!');
    expect(screen.getByText('Créditos disponíveis: 90')).toBeInTheDocument();
  });

  it('should disable the button during image generation', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ amount: 100 }) });
    // Mock a slow response for generate image
    mockFetch.mockResolvedValueOnce(new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve({ message: 'Image generation successful', remainingCredits: 90 }) }), 100)));

    render(<ImageGenerator />);

    const button = await screen.findByRole('button', { name: 'Gerar Fotos' });
    expect(button).toBeEnabled();

    fireEvent.click(button);

    // Button should be disabled immediately after click
    expect(button).toBeDisabled();

    // Wait for the process to complete
    await waitFor(() => expect(button).toBeEnabled());
  });

  it('should show error message if image generation fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ amount: 100 }) });
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(<ImageGenerator />);

    const button = await screen.findByRole('button', { name: 'Gerar Fotos' });
    fireEvent.click(button);

    await screen.findByText('Erro ao gerar imagem.');
  });

  it('should show insufficient credits message if backend returns 403', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ amount: 100 }) });
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403, json: () => Promise.resolve({ error: 'Insufficient credits' }) });

    render(<ImageGenerator />);

    const button = await screen.findByRole('button', { name: 'Gerar Fotos' });
    fireEvent.click(button);

    await screen.findByText('Créditos insuficientes para gerar imagens.');
  });
});
