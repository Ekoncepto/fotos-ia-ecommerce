'use client'; // This is a client component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ImageGenerator() {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const IMAGE_GENERATION_COST = 10; // Must match backend cost

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch('/api/credits');
        if (!response.ok) {
          throw new Error('Failed to fetch credits');
        }
        const data = await response.json();
        setCredits(data.amount);
      } catch (error) {
        console.error('Error fetching credits:', error);
        setMessage('Failed to load credits.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCredits();
  }, []);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async () => {
    if (credits === null || credits < IMAGE_GENERATION_COST || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setMessage('Gerando imagem...');
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 403) {
        setMessage('Créditos insuficientes para gerar imagens.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setCredits(data.remainingCredits);
      setMessage('Imagem gerada com sucesso!');
      router.refresh();
    } catch (error) {
      console.error('Error generating image:', error);
      setMessage('Erro ao gerar imagem.');
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = credits !== null && credits >= IMAGE_GENERATION_COST && !isGenerating;

  if (isLoading) {
    return <div>Carregando créditos...</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px' }}>
      <h2>Gerador de Imagens</h2>
      <p>Créditos disponíveis: {credits}</p>
      <p>Custo por geração: {IMAGE_GENERATION_COST} créditos</p>
      <button
        onClick={handleGenerateImage}
        disabled={!canGenerate}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: canGenerate ? 'pointer' : 'not-allowed',
          backgroundColor: canGenerate ? '#007bff' : '#cccccc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Gerar Fotos
      </button>
      {message && <p style={{ marginTop: '10px', color: canGenerate ? 'green' : 'red' }}>{message}</p>}
      {!canGenerate && credits !== null && (
        <p style={{ color: 'red' }}>Você não tem créditos suficientes para gerar imagens.</p>
      )}
    </div>
  );
}
