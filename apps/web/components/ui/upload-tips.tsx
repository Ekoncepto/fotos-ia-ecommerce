"use client";

import * as React from "react";

type UploadTipsProps = {
  className?: string;
};

/**
 * Non-interactive tips list displayed alongside the upload form.
 * Purely presentational to avoid interfering with upload interactions.
 */
export function UploadTips({ className }: UploadTipsProps) {
  const tips = React.useMemo(
    () => [
      "✅ Use boa iluminação (evite sombras duras)",
      "✅ Mantenha a foto nítida e focada",
      "✅ Centralize o produto e evite cortes",
      "✅ Fundo simples ajuda a IA a entender o objeto",
      "✅ Envie ângulos diferentes para melhor resultado",
    ],
    []
  );

  return (
    <section aria-label="Dicas de Foto" className={className}>
      <h3 className="text-sm font-medium mb-2">Dicas para uma boa foto de referência</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
        {tips.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </section>
  );
}

