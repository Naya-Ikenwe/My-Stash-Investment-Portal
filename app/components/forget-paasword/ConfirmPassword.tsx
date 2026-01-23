"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import CardWrapper from "../CardWrapper";
import { Button } from "@/components/ui/button";
import { resetPasswordService } from "@/app/api/Users";
import toast from "react-hot-toast";

type ConfirmPasswordProps = {
  email: string;
  token: string; // OTP from previous step
};

export default function ConfirmPassword({ email, token }: ConfirmPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleReset() {
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPasswordService({
        email,
        token,
        newPassword: password,
      });
      toast.success(data.message || "Password reset successful");
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="flex flex-col gap-7 text-center items-center justify-center">
        <CardWrapper className="px-24 py-16 flex flex-col gap-6 items-center w-[600px]">
          <img
            src="/Check.svg"
            alt="Success"
            className="w-45 h-45 mx-auto"
          />
          <h2 className="font-medium text-4xl text-primary">
            Successful!
          </h2>
          <p className="-mb-3">Password successfully updated.</p>

          <Button
            className="bg-purple-600 text-white w-[270px] px-10"
            onClick={() => (window.location.href = "/login")}
          >
            Sign In
          </Button>
        </CardWrapper>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-7 text-center items-center justify-center">
      <div>
        <h2 className="font-medium text-4xl text-primary">Reset Password</h2>
        <p>Set your new password</p>
      </div>

      <CardWrapper className="px-24 py-16 flex flex-col gap-6 items-start w-[600px]">
        <Input
          type="password"
          className="bg-white min-h-12"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <Input
          type="password"
          className="bg-white min-h-12"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />

        <Button
          className="bg-primary text-white"
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </CardWrapper>
    </main>
  );
}
