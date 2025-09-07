import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('user_credits') // Assuming 'user_credits' table
    .select('amount')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching credit balance:', error);
    return NextResponse.json({ error: 'Failed to fetch credit balance' }, { status: 500 });
  }

  if (!data) {
    // User might not have an entry yet, return 0 credits
    return NextResponse.json({ amount: 0 }, { status: 200 });
  }

  return NextResponse.json({ amount: data.amount }, { status: 200 });
}
