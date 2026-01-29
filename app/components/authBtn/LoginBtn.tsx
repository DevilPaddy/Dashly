"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    await signIn("google", { callbackUrl: "/app" });
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      aria-busy={loading}
      aria-disabled={loading}
      className={`
        w-full flex items-center justify-center gap-3
        rounded-xl border border-white/15
        bg-white text-black
        px-4 py-3
        font-medium
        transition-all duration-200
        hover:bg-neutral-100
        active:scale-[0.98]
        disabled:opacity-70
        disabled:cursor-not-allowed
      `}
    >
      {loading ? (
        <>
          {/* Spinner */}
          <span className="h-5 w-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
          <span>Signing in…</span>
        </>
      ) : (
        <>
          {/* Google Logo */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.67 1.23 9.14 3.64l6.82-6.82C35.82 2.54 30.47 0 24 0 14.6 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.5 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.1 24.55c0-1.64-.15-3.22-.43-4.75H24v9h12.47c-.54 2.9-2.18 5.36-4.65 7.02l7.15 5.56c4.18-3.86 6.63-9.54 6.63-16.83z"
            />
            <path
              fill="#FBBC05"
              d="M10.54 28.59c-.48-1.44-.76-2.98-.76-4.59s.27-3.15.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.14 15.9-5.82l-7.15-5.56c-1.98 1.33-4.51 2.12-8.75 2.12-6.26 0-11.57-4-13.46-9.41l-7.98 6.19C6.51 42.62 14.6 48 24 48z"
            />
          </svg>

          <span>Continue with Google</span>
        </>
      )}
    </button>
  );
}
