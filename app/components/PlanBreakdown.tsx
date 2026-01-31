"use client";

import CardWrapper from "@/app/components/CardWrapper";
import InstantTopup from "@/app/components/InstantTopup";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { PlanFormData } from "../types/plan";
import { UseFormReturn } from "react-hook-form";
import { createPlan } from "../api/Plan";

type Breakdown = {
  name: string;
  amount: number;
};

interface PaymentDetails {
  bankAccountNumber: string;
  bankName: string;
  channel: string;
  expiresIn: string;
  bankAccountName: string;
  amountToPay: number;
  reference: string;
}

interface PlanResponse {
  id: string;
  payoutAccountId: string;
  name: string;
  status: "PENDING" | "ACTIVE" | "MATURED";
}

interface CreatePlanResponse {
  data: {
    plan: PlanResponse;
    payment: PaymentDetails;
  };
  message: string;
  status: string;
}

export default function PlanBreakdown({
  onBack,
  form,
}: {
  onBack: () => void;
  form: UseFormReturn<PlanFormData>;
}) {
  const planData = form.getValues();
  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const initial: Breakdown[] = [
    { name: "August Interest", amount: 174171 },
    { name: "August Witholding Tax", amount: 1741 },
    { name: "August Net Interest", amount: 156771 },
  ];

  const subsequently: Breakdown[] = [
    { name: "Interest", amount: 2000000 },
    { name: "Witholding Tax", amount: 2000 },
    { name: "Net Interest", amount: 18000 },
  ];

  const total: Breakdown[] = [
    { name: "Interest", amount: 117475 },
    { name: "Witholding Tax", amount: 1174 },
    { name: "Net Interest", amount: 105677 },
  ];

  const [fundSourceOpen, setFundSourceOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null,
  );
  const [createdPlanId, setCreatedPlanId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAgreeAndContinue = async () => {
    if (!termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get the current form values
      const currentFormData = form.getValues();

      // DEBUG: Log everything
      console.log("📋 CURRENT FORM DATA in PlanBreakdown:", {
        allFields: currentFormData,
        payoutAccountId: currentFormData.payoutAccountId,
        hasPayoutAccountId: !!currentFormData.payoutAccountId,
        payoutAccountIdType: typeof currentFormData.payoutAccountId,
        payoutAccountIdLength: currentFormData.payoutAccountId?.length,
      });

      // Check if payoutAccountId is empty
      if (!currentFormData.payoutAccountId) {
        throw new Error(
          "Bank account not selected. Please go back and select a bank.",
        );
      }

      // Prepare the payload
      const completePayload = {
        name: currentFormData.name,
        principal: currentFormData.principal,
        duration: currentFormData.duration,
        startDate: currentFormData.startDate,
        endDate: currentFormData.endDate,
        payoutFrequency: "MONTHLY" as const,
        rollover: currentFormData.rollover,
        rolloverType: currentFormData.rolloverType,
        payoutAccountId: currentFormData.payoutAccountId, // This should come from form
      };

      console.log("🚀 Final payload for POST /plan:", completePayload);
      console.log(
        "🔗 Will call endpoint with bank ID:",
        currentFormData.payoutAccountId,
      );

      // Call the createPlan endpoint
      console.log("📞 Calling createPlan() API function...");
      const response: CreatePlanResponse = await createPlan(completePayload);

      console.log("✅ Plan creation API response:", {
        success: true,
        planId: response.data.plan.id,
        status: response.data.plan.status,
        paymentReference: response.data.payment.reference,
      });

      // Store the payment details from the response
      setPaymentDetails(response.data.payment);
      setCreatedPlanId(response.data.plan.id);

      console.log(
        "✅ Plan created successfully. Plan ID:",
        response.data.plan.id,
      );
      console.log("💰 Payment details:", response.data.payment);

      // Open the payment modal
      setFundSourceOpen(true);
      console.log("🔼 InstantTopup modal should now open");
      
    } catch (error: any) {
      console.error("❌ Failed to create plan:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        },
        formData: form.getValues(),
        payoutAccountId: form.getValues().payoutAccountId,
      });

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create plan. Please check all required fields.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CardWrapper className="max-w-4xl mx-auto px-20 py-8 relative flex flex-col gap-8">
        <div className="absolute top-5 left-5 p-2 bg-[#E7E7E7] rounded-full cursor-pointer">
          <IoIosArrowBack size={18} onClick={onBack} />
        </div>

        <div className="flex flex-col items-center gap-5 text-center">
          <div>
            <h2 className="text-2xl font-medium">Investment Breakdown</h2>
            <p className="text-primary">
              Kindly see investments terms & details below
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <p className="text-3xl font-bold">
                ₦{planData.principal.toLocaleString()}
              </p>
              <p>
                Interest rate:{" "}
                <span className="text-[#44C56F]">
                  24% per anum (2% per month)
                </span>{" "}
              </p>
            </div>

            <div className="flex gap-4 items-center">
              <span className="flex gap-2 items-center">
                <FaCircle />
                <p>Start Date: {formatDate(planData.startDate)} </p>
              </span>

              <span className="flex gap-2 items-center">
                <FaCircle className="text-primary" />
                <p>End Date: {formatDate(planData.endDate)}</p>
              </span>
            </div>

            {/* Display rollover settings from form */}
            <div className="mt-4 text-sm text-gray-600">
              <p>
                Reinvest after maturity:{" "}
                <span className="font-medium">
                  {planData.rollover ? "Yes" : "No"}
                </span>
                {planData.rollover &&
                  ` (${planData.rolloverType?.replace("_", " ")})`}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 text-[16px]">
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="mb-1.5 text-[#37474F] text-sm">Initial</h4>
              <hr className="border-[#455A6447]" />
            </div>
            <div className="flex flex-col gap-3">
              {initial.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <p>{item.name}</p>
                  <p>₦{item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h4 className="mb-1.5 text-[#37474F] text-sm">
                Subsequently(Monthly)
              </h4>
              <hr className="border-[#455A6447]" />
            </div>
            <div className="flex flex-col gap-3">
              {subsequently.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <p>{item.name}</p>
                  <p>₦{item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h4 className="mb-1.5 text-[#37474F] text-sm">Total</h4>
              <hr className="border-[#455A6447]" />
            </div>
            <div className="flex flex-col gap-3">
              {total.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <p>{item.name}</p>
                  <p>₦{item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form className="flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-primary font-semibold">
                Terms and Condition
              </h2>
              <p>
                Before proceeding to fund your investment plan, please read and
                agree to the terms & conditions below:{" "}
                <Link href={"#"} className="font-semibold hover:underline">
                  Read More...
                </Link>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                className="border-[#CDCFD0]"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              />
              <Label htmlFor="terms" className="text-sm">
                {" "}
                I have read and agree to the{" "}
                <span className="italic">Terms & Conditions</span>{" "}
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center font-medium">
            <button
              type="button"
              onClick={onBack}
              className="border border-primary text-primary w-full py-3 rounded-xl"
            >
              Go Back
            </button>

            <button
              type="button"
              disabled={!termsAccepted || isSubmitting}
              onClick={handleAgreeAndContinue}
              className="bg-primary text-white w-full py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Creating Plan...
                </>
              ) : (
                "Agree & Continue"
              )}
            </button>
          </div>
        </form>
      </CardWrapper>

      {/* InstantTopup Modal - Opens after plan is created */}
      {fundSourceOpen && paymentDetails && createdPlanId && (
        <InstantTopup
          isOpen={fundSourceOpen}
          paymentDetails={paymentDetails}
          planId={createdPlanId}
          onConfirm={() => {
            // Handled inside InstantTopup component
          }}
          onBack={() => setFundSourceOpen(false)}
        />
      )}
    </>
  );
}