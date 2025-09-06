import { ImageUploadForm } from "@/components/ui/image-upload-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Fotos IA E-commerce</h1>
      <p className="mt-4 text-lg">Gere imagens de produtos com IA.</p>
      <div className="mt-8 w-full max-w-lg">
        <ImageUploadForm />
      </div>
    </main>
  );
}
