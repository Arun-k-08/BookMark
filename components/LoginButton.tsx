"use client";

import { supabase } from "@/lib/supabase";

export default function LoginButton() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <button
      onClick={login}
      className="bg-black text-white px-4 py-2 rounded"
    >
      Sign in with Google
    </button>
  );
}
