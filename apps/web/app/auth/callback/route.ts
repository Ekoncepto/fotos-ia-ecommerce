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

      // Atomically allocate initial credits if the user doesn't have an entry yet.
      // The `onConflict` option with `ignoreDuplicates: true` ensures that if a row
      // with the same `user_id` already exists, the insert is ignored instead of
      // throwing an error. This is an atomic operation on the database side.
      const { error: creditError } = await supabase
        .from(creditsTableName)
        .insert(
          [{ user_id: userId, amount: initialCredits }],
          { onConflict: 'user_id', ignoreDuplicates: true }
        );

      if (creditError) {
        console.error('Error allocating initial credits:', creditError);
        // If credit allocation fails, we still log the user in but redirect
        // to an error page so the issue can be surfaced.
        return NextResponse.redirect(`${origin}/auth/credit-allocation-error`);
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
