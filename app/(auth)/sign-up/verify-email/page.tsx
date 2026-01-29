"use client";

import {
  verifyEmailService,
  resendVerificationOtpService,
} from "@/app/api/Users";
import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CardWrapper from "@/app/components/CardWrapper";
import { useAuthStore } from "@/app/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const { user, setUser } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [verifyError, setVerifyError] = useState("");
  const router = useRouter();

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const verify = async () => {
    if (!user?.email || !otp) {
      setVerifyError(otp ? "Email not found" : "Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setVerifyError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    setVerifyError("");

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
    } catch (err: any) {
      console.error("Email verification failed", err);
      setVerifyError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!user?.email || !canResend) return;

    setResending(true);
    setResendSuccess(false);
    setResendError("");

    try {
      await resendVerificationOtpService({
        email: user.email,
      });

      console.log("OTP resent successfully");
      setResendSuccess(true);
      
      // Set cooldown period (60 seconds)
      setCanResend(false);
      setCountdown(60);
      
    } catch (err: any) {
      console.error("Failed to resend OTP", err);
      setResendError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
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
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(value);
              setVerifyError("");
            }}
            className="mt-9 mb-7 bg-white w-[500px] h-12"
            maxLength={6}
          />

          {verifyError && (
            <p className="text-red-500 text-sm mb-4">{verifyError}</p>
          )}

          <div className="flex flex-col gap-5">
            <Link href="#" className="text-primary">
              Check your email
            </Link>

            <div className="flex flex-col gap-2 items-start">
              <Button onClick={verify} disabled={loading || otp.length !== 6}>
                {loading ? "Verifying..." : "Continue"}
              </Button>

              <p className="text-xs">
                Didn't get OTP?{" "}
                <button
                  onClick={resendOtp}
                  disabled={resending || !canResend}
                  className={`text-primary font-medium text-sm ${
                    (resending || !canResend) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {resending ? "Resending..." : 
                   !canResend ? `Resend (${countdown}s)` : 
                   "Resend"}
                </button>
              </p>
              
              {resendSuccess && (
                <p className="text-green-600 text-xs mt-1">OTP has been resent!</p>
              )}
              
              {resendError && (
                <p className="text-red-500 text-xs mt-1">{resendError}</p>
              )}
            </div>
          </div>
        </CardWrapper>
      </main>
    </AuthWrapper>
  );
}