import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { IMAGE_GENERATION_COST } from 'config/credits';

export async function POST(request: Request) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase.rpc('deduct_credits', {
    user_id_input: user.id,
    cost: IMAGE_GENERATION_COST,
  });

  if (error) {
    if (error.message.includes('Insufficient credits')) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }
    console.error('Error deducting credits:', error);
    return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 });
  }

  // TODO: Integrate with actual image generation service (e.g., Gemini API)
  console.log(`User ${user.id} generated an image. Remaining credits: ${data}`);

  return NextResponse.json({ message: 'Image generation successful', remainingCredits: data }, { status: 200 });
}
