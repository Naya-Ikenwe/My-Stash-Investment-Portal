"use client";

import { useState } from "react";
import AuthWrapper from "@/app/components/auth/AuthWrapper";
import ConfirmPassword from "@/app/components/forget-paasword/ConfirmPassword";
import EmailInput from "@/app/components/forget-paasword/EmailInput";
import OtpInput from "@/app/components/forget-paasword/OtpInput";

export default function ForgetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(""); // store user email
  const [token, setToken] = useState(""); // store OTP as token

  return (
    <AuthWrapper>
      {step === 1 && (
        <EmailInput
          onNext={(enteredEmail) => {
            setEmail(enteredEmail);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <OtpInput
          onNext={(enteredOtp) => {
            setToken(enteredOtp); // OTP = token
            setStep(3);
          }}
        />
      )}

      {step === 3 && <ConfirmPassword email={email} token={token} />}
    </AuthWrapper>
  );
}
