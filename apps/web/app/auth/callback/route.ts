import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { INITIAL_CREDITS } from 'config/credits';

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
      const creditsTableName = 'user_credits'; // TODO: Confirm actual table name

      // Atomically allocate initial credits if the user doesn't have an entry yet.
      // The `upsert` method with the `onConflict` option ensures that if a row
      // with the same `user_id` already exists, the insert is ignored instead of
      // throwing an error. This is an atomic operation on the database side.
      const { error: creditError } = await supabase
        .from(creditsTableName)
        .upsert(
          [{ user_id: userId, amount: INITIAL_CREDITS }],
          { onConflict: 'user_id' }
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
