import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { IMAGE_GENERATION_COST } from 'config/credits';

// Helper function to create a delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const supabase = createClient();

  // 1. Get user and product_id from request
  const { product_id } = await request.json();
  if (!product_id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Deduct credits
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

  // 3. Fetch product information (optional for mock, but good practice)
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('name')
    .eq('id', product_id)
    .single();

  if (productError || !product) {
    console.error('Error fetching product:', productError);
    return NextResponse.json({ error: 'Failed to find product' }, { status: 404 });
  }

  // 4. Mock AI Image Generation
  // Simulate a delay for the generation process
  await sleep(2000);

  // Create placeholder images based on product name
  const productNameEncoded = encodeURIComponent(product.name);
  const imageUrls = [
    `https://placehold.co/1024x1024/FFFFFF/000000/png?text=${productNameEncoded}\\n(Fundo Branco)`,
    `https://placehold.co/1024x1024/CCCCCC/000000/png?text=${productNameEncoded}\\n(Estilo de Vida)`,
  ];

  // In a real application, you would save these URLs to the product record:
  // await supabase.from('products').update({ generated_image_urls: imageUrls }).eq('id', product_id);

  console.log(`User ${user.id} generated images for product ${product_id}. Remaining credits: ${remainingCredits}`);

  // 5. Return the generated image URLs and remaining credits
  return NextResponse.json({
    message: 'Image generation successful',
    remainingCredits,
    imageUrls,
  }, { status: 200 });
}
