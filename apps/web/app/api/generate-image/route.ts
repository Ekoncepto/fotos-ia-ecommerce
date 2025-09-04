import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const IMAGE_GENERATION_COST = 10; // Assuming 10 credits per image generation

export async function POST(request: Request) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Check user's credit balance
  const { data: creditsData, error: fetchCreditsError } = await supabase
    .from('user_credits')
    .select('amount')
    .eq('user_id', user.id)
    .single();

  if (fetchCreditsError) {
    console.error('Error fetching credit balance for image generation:', fetchCreditsError);
    return NextResponse.json({ error: 'Failed to fetch credit balance' }, { status: 500 });
  }

  const currentCredits = creditsData?.amount || 0;

  // 2. Handle insufficient credit scenarios
  if (currentCredits < IMAGE_GENERATION_COST) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
  }

  // 3. Deduct credits
  const newCredits = currentCredits - IMAGE_GENERATION_COST;
  const { error: updateCreditsError } = await supabase
    .from('user_credits')
    .update({ amount: newCredits })
    .eq('user_id', user.id);

  if (updateCreditsError) {
    console.error('Error deducting credits for image generation:', updateCreditsError);
    return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 });
  }

  // 4. Proceed with (placeholder) image generation
  // TODO: Integrate with actual image generation service (e.g., Gemini API)
  console.log(`User ${user.id} generated an image. Remaining credits: ${newCredits}`);

  return NextResponse.json({ message: 'Image generation successful', remainingCredits: newCredits }, { status: 200 });
}
