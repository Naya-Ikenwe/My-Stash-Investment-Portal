"use client";

import CardWrapper from "@/app/components/CardWrapper";
import InstantTopup from "@/app/components/InstantTopup";
import BankTransferModal from "@/app/components/BankTransferModal";
import PaymentMethodSelection from "@/app/components/PaymentMethodSelection";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { PlanFormData } from "../types/plan";
import { UseFormReturn } from "react-hook-form";
import {
  createPlan,
  calculatePlanSummary,
  PlanSummaryData,
  InstantTransferDetails,
  BankTransferDetails,
} from "../api/Plan";

type Breakdown = {
  name: string;
  amount: number;
};

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

  const [initial, setInitial] = useState<Breakdown[]>([]);
  const [subsequently, setSubsequently] = useState<Breakdown[]>([]);
  const [total, setTotal] = useState<Breakdown[]>([]);
  const [roiRate, setRoiRate] = useState<number>(0);
  const [showMethodSelection, setShowMethodSelection] = useState(false);
  const [showInstantTransfer, setShowInstantTransfer] = useState(false);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [instantTransfer, setInstantTransfer] = useState<InstantTransferDetails | null>(null);
  const [bankTransfer, setBankTransfer] = useState<BankTransferDetails | null>(null);
  const [createdPlanId, setCreatedPlanId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Fetch plan summary on component mount
  useEffect(() => {
    const fetchPlanSummary = async () => {
      try {
        setIsLoadingSummary(true);
        const response = await calculatePlanSummary({
          duration: planData.duration,
          payoutFrequency: "MONTHLY",
          principal: planData.principal,
        });

        if (response.data) {
          const summary = response.data;

          // Build breakdown sections from API response
          const initialBreakdown: Breakdown[] = [
            { name: "Principal Amount", amount: summary.principal },
            { name: "Expected ROI (Gross)", amount: summary.expectedRoiGross },
            { name: "Withholding Tax", amount: summary.withholdingTax },
            { name: "Expected ROI (Net)", amount: summary.expectedRoi },
          ];

          const subsequentlyBreakdown: Breakdown[] = [
            {
              name: "Payout Per Period",
              amount: summary.payoutPerPeriod,
            },
            {
              name: "Number of Payouts",
              amount: summary.numberOfPayouts,
            },
          ];

          const totalBreakdown: Breakdown[] = [
            { name: "Total Expected Returns", amount: summary.totalExpectedReturns },
            {
              name: "Total Interest Earned",
              amount: summary.totalExpectedReturns - summary.principal,
            },
            { name: "ROI Rate", amount: summary.roiRate * 100 },
          ];

          setInitial(initialBreakdown);
          setSubsequently(subsequentlyBreakdown);
          setTotal(totalBreakdown);
          setRoiRate(summary.roiRate * 100);
        }
      } catch (err: any) {
        console.error("Failed to fetch plan summary:", err);
        setError("Failed to load plan summary. Please try again.");
      } finally {
        setIsLoadingSummary(false);
      }
    };

    fetchPlanSummary();
  }, [planData.duration, planData.principal]);

  const handleAgreeAndContinue = async () => {
    if (!termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const currentFormData = form.getValues();

      console.log("📋 Creating plan with data:", {
        name: currentFormData.name,
        principal: currentFormData.principal,
        duration: currentFormData.duration,
      });

      // Prepare the payload - simplified based on new endpoint
      const completePayload = {
        name: currentFormData.name,
        principal: currentFormData.principal,
        duration: currentFormData.duration,
        payoutFrequency: "MONTHLY",
        rolloverType: currentFormData.rolloverType || "PRINCIPAL_ONLY",
      };

      console.log("🚀 Final payload for POST /plan:", completePayload);

      // Call the createPlan endpoint
      console.log("📞 Calling createPlan() API function...");
      const response = await createPlan(completePayload as any);

      console.log("✅ Plan creation API response:", {
        success: true,
        planId: response.data.plan.id,
        status: response.data.plan.status,
      });

      // Store the payment details from the response
      setInstantTransfer(response.data.payment.instantTransfer);
      setBankTransfer(response.data.payment.bankTransfer);
      setCreatedPlanId(response.data.plan.id);

      console.log("✅ Plan created successfully. Plan ID:", response.data.plan.id);
      console.log("💰 Payment methods available:", {
        instantTransfer: response.data.payment.instantTransfer,
        bankTransfer: response.data.payment.bankTransfer,
      });

      // Show payment method selection modal
      setShowMethodSelection(true);
    } catch (error: any) {
      console.error("❌ Failed to create plan:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create plan. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectInstantTransfer = () => {
    setShowMethodSelection(false);
    setShowInstantTransfer(true);
  };

  const handleSelectBankTransfer = () => {
    setShowMethodSelection(false);
    setShowBankTransfer(true);
  };

  const handleBackFromPayment = () => {
    setShowInstantTransfer(false);
    setShowBankTransfer(false);
    setShowMethodSelection(true);
  };

  const handleClosePaymentFlow = () => {
  setShowMethodSelection(false);
  setShowInstantTransfer(false);
  setShowBankTransfer(false);
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
                  {roiRate.toFixed(2)}% per anum ({(roiRate / 12).toFixed(2)}% per month)
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
          {isLoadingSummary ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading plan summary...</p>
            </div>
          ) : (
            <>
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
                    Payout Details
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
                      <p>
                        {item.name === "Number of Payouts"
                          ? item.amount
                          : `₦${item.amount.toLocaleString()}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="mb-1.5 text-[#37474F] text-sm">Summary</h4>
                  <hr className="border-[#455A6447]" />
                </div>
                <div className="flex flex-col gap-3">
                  {total.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <p>{item.name}</p>
                      <p>
                        {item.name === "ROI Rate"
                          ? `${item.amount.toFixed(2)}%`
                          : `₦${item.amount.toLocaleString()}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
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

      {/* Payment Method Selection Modal */}
      {showMethodSelection && instantTransfer && bankTransfer && createdPlanId && (
  <PaymentMethodSelection
    isOpen={showMethodSelection}
    instantTransfer={instantTransfer}
    bankTransfer={bankTransfer}
    onSelectInstant={handleSelectInstantTransfer}
    onSelectBank={handleSelectBankTransfer}
    onClose={handleClosePaymentFlow} // 👈 Use this instead of handleBackFromPayment
  />
)}

      {/* Instant Transfer Modal */}
      {showInstantTransfer && instantTransfer && createdPlanId && (
        <InstantTopup
          isOpen={showInstantTransfer}
          instantTransfer={instantTransfer}
          planId={createdPlanId}
          onConfirm={() => {
            // Handled inside InstantTopup component
          }}
          onBack={handleBackFromPayment}
        />
      )}

      {/* Bank Transfer Modal */}
      {showBankTransfer && bankTransfer && createdPlanId && (
        <BankTransferModal
          isOpen={showBankTransfer}
          bankTransfer={bankTransfer}
          planId={createdPlanId}
          onBack={handleBackFromPayment}
        />
      )}
    </>
  );
}
