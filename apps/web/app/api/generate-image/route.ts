import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { IMAGE_GENERATION_COST } from 'config/credits';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates a call to an AI image generation service with a retry mechanism.
 */
async function generateImagesWithRetry(productName: string): Promise<string[]> {
  const MAX_RETRIES = 3;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      // TODO: BUS-001 - Implement sophisticated prompt engineering here.
      // The prompt should be constructed based on product name, category,
      // reference images, and user preferences to maximize image quality.

      // Simulate network delay and processing time of the AI service.
      await sleep(2000);

      // To test retries, one could simulate a failure here, e.g.,
      // if (i < 2) throw new Error("AI service temporarily unavailable");

      const productNameEncoded = encodeURIComponent(productName);
      const imageUrls = [
        `https://placehold.co/1024x1024/FFFFFF/000000/png?text=${productNameEncoded}\\n(Fundo Branco)`,
        `https://placehold.co/1024x1024/CCCCCC/000000/png?text=${productNameEncoded}\\n(Estilo de Vida)`,
      ];

      // If successful, return the URLs.
      return imageUrls;
    } catch {
      console.error(`Attempt ${i + 1} failed for image generation. Retrying...`);
      if (i === MAX_RETRIES - 1) {
        // If this was the last retry, re-throw the error.
        throw new Error("AI image generation failed after multiple attempts.");
      }
    }
  }
  // This line should be unreachable, but typescript needs it.
  throw new Error("Image generation failed unexpectedly.");
}


export async function POST(request: Request) {
  const supabase = createClient();

  const { product_id } = await request.json();
  if (!product_id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: remainingCredits, error: creditError } = await supabase.rpc('deduct_credits', {
    user_id_input: user.id,
    cost: IMAGE_GENERATION_COST,
  });

  if (creditError) {
    if (creditError.message.includes('Insufficient credits')) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }
    console.error('Error deducting credits:', creditError);
    return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 });
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('name')
    .eq('id', product_id)
    .single();

  if (productError || !product) {
    console.error('Error fetching product:', productError);
    return NextResponse.json({ error: 'Failed to find product' }, { status: 404 });
  }

  try {
    // TODO: TECH-001 - For a real implementation, add a circuit breaker (e.g., using 'opossum')
    // around this call to prevent cascading failures if the AI service is down.
    const imageUrls = await generateImagesWithRetry(product.name);

    console.log(`User ${user.id} generated images for product ${product_id}. Remaining credits: ${remainingCredits}`);

    return NextResponse.json({
      message: 'Image generation successful',
      remainingCredits,
      imageUrls,
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating images:', error);
    // TODO: Here you might want to refund the credits if the generation ultimately fails.
    return NextResponse.json({ error: 'Image generation failed after multiple retries.' }, { status: 500 });
  }
}
