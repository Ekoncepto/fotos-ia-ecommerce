"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Button onClick={handleSignIn}>Sign in with Google</Button>
    </div>
  );
}
