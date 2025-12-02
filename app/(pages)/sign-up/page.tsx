"use client";

import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CreateAccount from "@/app/components/auth/CreateAccount";
import VerifyIdentity from "@/app/components/auth/VerifyIdentity";
import { useState } from "react";
import { RxDividerVertical } from "react-icons/rx";

export default function SignUpPage() {
  const [step, setStep] = useState("create");
  const goToVerify = () => {
    setStep("verify");
  };

  return (
    <AuthWrapper className="flex gap-10 -mt-10">
      <div>
        {step === "create" ? (
          <CreateAccount onNext={goToVerify} />
        ) : (
          <VerifyIdentity />
        )}
      </div>

      <aside className="flex flex-col gap-9">
        <div>
          <h2 className="text-primary text-[34px] font-medium">
            Lets get you set up in just 2 steps{" "}
          </h2>
          <p>
            We&apos;ll keep it short and simple, just what we need to
            personalize your experience
          </p>
        </div>

        <div className="flex flex-col">
          <div className="flex gap-1 items-center">
            <p
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step === "create"
                  ? "text-white bg-primary"
                  : "border text-[#455A64A3]"
              }`}
            >
              1
            </p>
            <p>Create Your Account</p>
          </div>

          <div className="w-8 h-8 flex items-center justify-center">
            <RxDividerVertical size={24} className="text-[#455A64A3]" />
          </div>

          <div className="flex gap-1 items-center">
            <p
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step === "verify"
                  ? "text-white bg-primary"
                  : "border text-[#455A64A3]"
              }`}
            >
              2
            </p>
            <p>Enter Your Information</p>
          </div>
        </div>
      </aside>
    </AuthWrapper>
  );
}
