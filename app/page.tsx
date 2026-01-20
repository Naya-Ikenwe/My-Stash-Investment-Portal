"use client";

import { useRouter } from "next/navigation";
import AuthWrapper from "./components/auth/AuthWrapper";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    if (accessToken) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
    console.log("HYDRATION:", hasHydrated);
    console.log("ACCESS TOKEN:", accessToken);
  }, [accessToken, hasHydrated, router]);

  // While checking, you might want to show nothing or a spinner to prevent flashing
  // if you want strict redirection.
  // Otherwise, render the Landing Page below:

  return (
    <AuthWrapper className="flex items-center justify-center">
      <p>Loading....</p>
    </AuthWrapper>
  );
}
