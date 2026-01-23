"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import CardWrapper from "../CardWrapper";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type OtpInputProps = {
  onNext: (otp: string) => void;
};

export default function OtpInput({ onNext }: OtpInputProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  function handleNext() {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP sent to your email");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onNext(otp); // send OTP as token
      setLoading(false);
    }, 300);
  }

  return (
    <main className="flex flex-col gap-7 text-center items-center justify-center">
      <div>
        <h2 className="font-medium text-4xl text-primary">Reset Password</h2>
        <p>Enter the 6-digit OTP sent to your email</p>
      </div>

      <CardWrapper className="px-24 py-16 flex flex-col gap-6 items-start w-[600px]">
        <Input
          type="number"
          className="bg-white min-h-12"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={loading}
        />
        <Button
          className="bg-primary text-white"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Next"}
        </Button>
      </CardWrapper>
    </main>
  );
}
