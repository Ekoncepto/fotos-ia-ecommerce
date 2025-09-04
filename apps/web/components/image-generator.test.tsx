import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ImageGenerator from './image-generator';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}));

describe('ImageGenerator', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch; // Mock global fetch
  });

  it('should display loading state initially', () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ amount: 100 }) });
    act(() => {
      render(<ImageGenerator />);
    });
    expect(screen.getByText('Carregando créditos...')).toBeInTheDocument();
  });

  it('should display credits and enable button if sufficient credits', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ amount: 100 }) });
    act(() => {
      render(<ImageGenerator />);
    });
    await waitFor(() => expect(screen.getByText('Créditos disponíveis: 100')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Gerar Fotos' })).toBeEnabled();
  });

  it('should display insufficient credits message and disable button if insufficient credits', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ amount: 5 }) });
    act(() => {
      render(<ImageGenerator />);
    });
    await waitFor(() => expect(screen.getByText('Créditos disponíveis: 5')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Gerar Fotos' })).toBeDisabled();
    expect(screen.getByText(/Você não tem créditos suficientes para gerar imagens/i)).toBeInTheDocument();
  });

  it('should deduct credits and show success message on successful generation', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ amount: 100 }) }); // Initial credits
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ message: 'Image generation successful', remainingCredits: 90 }) }); // Generate image

    act(() => {
      render(<ImageGenerator />);
    });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Gerar Fotos' })).toBeEnabled());

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Gerar Fotos' }));
    });

    await waitFor(() => expect(screen.getByText('Imagem gerada com sucesso!')).toBeInTheDocument());
    expect(screen.getByText('Créditos disponíveis: 90')).toBeInTheDocument();
  });

  it('should show error message if image generation fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ amount: 100 }) }); // Initial credits
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 }); // Generate image fails

    act(() => {
      render(<ImageGenerator />);
    });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Gerar Fotos' })).toBeEnabled());

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Gerar Fotos' }));
    });

    await waitFor(() => expect(screen.getByText('Erro ao gerar imagem.')).toBeInTheDocument());
  });

  it('should show insufficient credits message if backend returns 403', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ amount: 5 }) }); // Initial credits
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 }); // Generate image returns 403

    act(() => {
      render(<ImageGenerator />);
    });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Gerar Fotos' })).toBeDisabled());

    // Even if button is disabled, if somehow clicked (e.g., direct function call), it should handle 403
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Gerar Fotos' }));
    });

    await waitFor(() => expect(screen.getByText(/Créditos insuficientes para gerar imagens/i)).toBeInTheDocument());
  });
});
