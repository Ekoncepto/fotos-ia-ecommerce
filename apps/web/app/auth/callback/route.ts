import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      const userId = data.user.id;
      const initialCredits = 100; // TODO: Make this configurable (e.g., from environment variables or a config table)
      const creditsTableName = 'user_credits'; // TODO: Confirm actual table name

      // Check if the user already has credits to prevent re-allocation on subsequent logins
      const { data: existingCredits, error: fetchError } = await supabase
        .from(creditsTableName)
        .select('id')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') { // PGRST116 means "no rows found"
        // User does not have existing credits, allocate them
        const { error: insertError } = await supabase
          .from(creditsTableName)
          .insert([
            { user_id: userId, amount: initialCredits }
          ]);

        if (insertError) {
          console.error('Error allocating initial credits:', insertError);
          // Optionally, redirect to an error page or handle gracefully
          return NextResponse.redirect(`${origin}/auth/credit-allocation-error`);
        }
      } else if (fetchError) {
        console.error('Error checking existing credits:', fetchError);
        // Optionally, redirect to an error page or handle gracefully
        return NextResponse.redirect(`${origin}/auth/credit-check-error`);
      }
      // If existingCredits is not null, credits already exist, do nothing.

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
