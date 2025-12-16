"use client";

import { useRouter } from "next/navigation";
import AuthWrapper from "./components/auth/AuthWrapper";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  // Optional: check if store has finished hydrating from localStorage
  // const hasHydrated = useAuthStore((state) => state._hasHydrated);

  useEffect(() => {
    // If a token exists, skip the landing page and go to dashboard
    if (accessToken) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [accessToken, router]);

  // While checking, you might want to show nothing or a spinner to prevent flashing
  // if you want strict redirection.
  // Otherwise, render the Landing Page below:

  return (
    <AuthWrapper className="">
      <main className="flex items-center justify-center">
        <p>Loading....</p>
      </main>
    </AuthWrapper>
  );
}
