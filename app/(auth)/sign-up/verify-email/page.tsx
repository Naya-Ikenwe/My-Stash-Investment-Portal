"use client";

import { verifyEmailService } from "@/app/api/Users";
import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CardWrapper from "@/app/components/CardWrapper";
import { useAuthStore } from "@/app/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailPage() {
  const { user, setUser } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const verify = async () => {
    if (!user?.email || !otp) return;

    setLoading(true);

    try {
      await verifyEmailService({
        email: user.email,
        token: otp,
      });

      setUser({
        ...user,
        isEmailVerified: true,
      });

      router.push("/sign-up/verify-identity");
    } catch (err) {
      console.error("Email verification failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <main className="w-full flex items-center justify-center">
        <CardWrapper className="px-20 py-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-primary font-heading text-[20px]">
              Enter the 6-digit code that we sent to
            </h2>

            <span className="flex flex-col gap-0.5">
              <p>{user?.email}</p>
              <Link href="#" className="text-primary">
                Wrong Email?
              </Link>
            </span>
          </div>

          <Input
            placeholder="Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-9 mb-7 bg-white w-[500px] h-12"
          />

          <div className="flex flex-col gap-5">
            <Link href="#" className="text-primary">
              Check your email
            </Link>

            <div className="flex flex-col gap-2 items-start">
              <Button onClick={verify} disabled={loading}>
                {loading ? "Verifying..." : "Continue"}
              </Button>

              <p className="text-xs">
                Didn&apos;t get OTP?{" "}
                <span className="text-primary font-medium text-sm">Resend</span>
              </p>
            </div>
          </div>
        </CardWrapper>
      </main>
    </AuthWrapper>
  );
}
