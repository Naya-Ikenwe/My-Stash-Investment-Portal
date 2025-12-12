"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import AuthWrapper from "./auth/AuthWrapper";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/"); // redirect to login
    }
  }, [accessToken]);

  // Avoid flashing content until we know the auth state
  if (!accessToken || !user)
    return (
      <AuthWrapper className="">
        <main className="flex items-center justify-center">
          <p>Loading....</p>
        </main>
      </AuthWrapper>
    );

  return <>{children}</>;
}

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "../store/authStore";

// export default function AuthGuard({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const token = useAuthStore((state) => state.token);
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//     if (!token) {
//       router.push("/login");
//     }
//   }, [token, router]);

//   // Prevent flash of unauthenticated content
//   if (!isMounted || !token) {
//     return <div className="p-10 text-center">Loading...</div>; // Or a Spinner
//   }

//   return <>{children}</>;
// }
