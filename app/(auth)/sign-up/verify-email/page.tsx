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
  const { user } = useAuthStore();
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const verify = async () => {
    if (!user?.email) {
      console.error("User email is missing");
      return;
    }

    if (!otp || otp.length !== 6) {
      console.error("Invalid OTP");
      return;
    }

    const payload = {
      email: user.email,
      token: otp,
    };

    const res = await verifyEmailService(payload);
    console.log(res);
    router.push("/sign-up/verify-identity");
  };

  return (
    <AuthWrapper>
      <main className="w-full flex items-center justify-center ">
        <CardWrapper className="px-20 py-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-primary">
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
            onChange={(e) => {
              setOtp(e.target.value);
            }}
            id="token"
            className="mt-9 mb-7 bg-white w-[500px] h-12"
          />

          <div className="flex flex-col gap-5">
            <Link href={"#"} className="text-primary">
              Check your email
            </Link>

            <div className="flex flex-col gap-2 items-start">
              <Button className="" onClick={() => verify()}>
                Continue
              </Button>

              <p className="text-xs">
                Didn&apos;t get OTP?{" "}
                <span className="text-primary font-medium text-sm">Resend</span>{" "}
              </p>
            </div>
          </div>
        </CardWrapper>
      </main>
    </AuthWrapper>
  );
}
