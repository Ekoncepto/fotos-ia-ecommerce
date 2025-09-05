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

export function ImageUploadForm() {
  const supabase = createClient();
  const [productName, setProductName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isButtonDisabled = !productName || !category || !files || files.length === 0 || isSubmitting;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      alert("Por favor, selecione as imagens de referência.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      const referenceImageUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || "Falha no upload da imagem.");
        }

        const { publicUrl } = await response.json();
        referenceImageUrls.push(publicUrl);
      }

      const { error: insertError } = await supabase.from("products").insert({
        user_id: user.id,
        name: DOMPurify.sanitize(productName),
        information: DOMPurify.sanitize(category),
        reference_image_urls: referenceImageUrls,
      });

      if (insertError) {
        throw insertError;
      }

      alert("Produto e imagens enviados com sucesso!");
      // Reset form
      setProductName("");
      setCategory("");
      setFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error("Erro no envio:", error);
      alert(`Ocorreu um erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
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
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                placeholder="Ex: Camisa de Algodão Branca"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                placeholder="Ex: Vestuário"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
          </div>
          <CardFooter className="flex justify-end pt-4">
            <Button type="submit" disabled={isButtonDisabled}>
              {isSubmitting ? "Enviando..." : "Gerar Fotos"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
