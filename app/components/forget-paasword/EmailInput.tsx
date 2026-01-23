"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import CardWrapper from "../CardWrapper";
import { Button } from "@/components/ui/button";
import { forgotPasswordService } from "@/app/api/Users";
import toast from "react-hot-toast";

type EmailInputProps = {
  onNext: (email: string) => void;
};

export default function EmailInput({ onNext }: EmailInputProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const data = await forgotPasswordService({ email });
      toast.success(data.message || "Password reset email sent");
      onNext(email);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col gap-7 text-center items-center justify-center">
      <div>
        <h2 className="font-medium text-4xl text-primary">Reset Password</h2>
        <p>Input your email address</p>
      </div>

      <CardWrapper className="px-24 py-16 flex flex-col gap-6 items-start w-[600px]">
        <Input
          type="email"
          className="bg-white min-h-12"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <Button
          className="bg-primary text-white"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Password"}
        </Button>
      </CardWrapper>
    </main>
  );
}
