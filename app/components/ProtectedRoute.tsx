"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import Cookies from "js-cookie";

type ProtectedRouteProps = { children: ReactNode };

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, setUser, setAccessToken, setRefreshToken } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    const storedUser = Cookies.get("user");

    if (!user) {
      if (accessToken && refreshToken) {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        if (storedUser) setUser(JSON.parse(storedUser));
        // else: optionally fetch user from backend
      } else {
        router.push("/login");
      }
    }

    setLoading(false);
  }, [user, router, setAccessToken, setRefreshToken, setUser]);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}
