"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import DOMPurify from 'dompurify';
import { IMAGE_GENERATION_COST } from 'config/credits';

export function ImageUploadForm() {
  const supabase = createClient();
  const [productName, setProductName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // State from ImageGenerator
  const [credits, setCredits] = React.useState<number | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = React.useState(true);
  const [message, setMessage] = React.useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = React.useState<string[]>([]);

  // Fetch credits on component mount
  React.useEffect(() => {
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
        setIsLoadingCredits(false);
      }
    }
    fetchCredits();
  }, []);

  const canGenerate = credits !== null && credits >= IMAGE_GENERATION_COST;
  const isFormInvalid = !productName || !category || !files || files.length === 0;
  const isButtonDisabled = isFormInvalid || isGenerating || !canGenerate;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isButtonDisabled) {
      if (!canGenerate) {
        setMessage("Créditos insuficientes para gerar imagens.");
      }
      return;
    }

    setIsGenerating(true);
    setMessage("Iniciando processo...");
    setGeneratedImages([]);

    try {
      // 1. Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      // 2. Upload reference images
      setMessage("Enviando imagens de referência...");
      const referenceImageUrls: string[] = [];
      for (const file of Array.from(files!)) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const { error } = await uploadResponse.json();
          throw new Error(error || "Falha no upload da imagem.");
        }

        const { publicUrl } = await uploadResponse.json();
        referenceImageUrls.push(publicUrl);
      }

      // 3. Create product record in Supabase
      setMessage("Salvando informações do produto...");
      const { data: productData, error: insertError } = await supabase.from("products").insert({
        user_id: user.id,
        name: DOMPurify.sanitize(productName),
        information: DOMPurify.sanitize(category),
        reference_image_urls: referenceImageUrls,
      }).select().single();

      if (insertError) {
        throw insertError;
      }
      if (!productData) {
        throw new Error("Failed to get product data after creation.");
      }

      const productId = productData.id;

      // 4. Call image generation API
      setMessage("Gerando novas imagens... Isso pode levar um momento.");
      const generateResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });

      if (generateResponse.status === 403) {
        throw new Error("Créditos insuficientes para gerar imagens.");
      }
      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const result = await generateResponse.json();

      // 5. Update state with results
      setCredits(result.remainingCredits);
      setGeneratedImages(result.imageUrls);
      setMessage("Imagens geradas com sucesso!");

      // Reset form
      setProductName("");
      setCategory("");
      setFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error("Erro no processo de geração:", error);
      let friendlyMessage = 'Ocorreu um erro inesperado durante o processo.';
      if (error instanceof Error) {
        if (error.message.includes('multiple retries')) {
          friendlyMessage = 'Não foi possível gerar as imagens no momento. Por favor, tente novamente mais tarde.';
        } else {
          friendlyMessage = error.message;
        }
      }
      setMessage(`Erro: ${friendlyMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Gerador de Imagens de Produto</CardTitle>
        <CardDescription>
          Faça o upload das suas imagens de referência e nós criaremos novas fotos para o seu produto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          {isLoadingCredits ? (
            <p>Carregando créditos...</p>
          ) : (
            <>
              <p>Créditos disponíveis: {credits}</p>
              <p>Custo por geração: {IMAGE_GENERATION_COST} créditos</p>
            </>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                placeholder="Ex: Camisa de Algodão Branca"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                placeholder="Ex: Vestuário"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="pictures">Imagens de Referência</Label>
              <Input
                id="pictures"
                type="file"
                multiple
                ref={fileInputRef}
                onChange={(e) => setFiles(e.target.files)}
                disabled={isGenerating}
              />
            </div>
          </div>
          <CardFooter className="flex flex-col items-end pt-4">
            <Button type="submit" disabled={isButtonDisabled}>
              {isGenerating ? "Gerando..." : "Gerar Fotos"}
            </Button>
            {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
             {!canGenerate && credits !== null && !isLoadingCredits && (
                <p style={{ color: 'red' }}>Você não tem créditos suficientes para gerar imagens.</p>
            )}
          </CardFooter>
        </form>
      </CardContent>
      {generatedImages.length > 0 && (
        <CardFooter className="flex flex-col items-center w-full">
          <h3 className="text-lg font-semibold mb-2">Imagens Geradas</h3>
          <div className="grid grid-cols-2 gap-4 w-full">
            {generatedImages.map((src, index) => (
              <div key={index}>
                <img src={src} alt={`Generated image ${index + 1}`} className="rounded-md" />
                <p className="text-center text-sm mt-1">{index === 0 ? 'Fundo Branco' : 'Estilo de Vida'}</p>
              </div>
            ))}
          </div>
          {/* TODO: BUS-001 - Implement user feedback mechanism. This could involve a modal with a form. */}
          <Button variant="outline" disabled className="mt-4">
            Avaliar Imagens
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
