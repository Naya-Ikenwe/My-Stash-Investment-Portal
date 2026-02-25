"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import TopUpModal from "@/app/components/TopupModal";
import ContinueLiquidate from "@/app/components/ContinueLiquidate";
import RolloverModal from "@/app/components/RolloverModal";
import WithdrawModal from "@/app/components/WithdrawModal";
import PaymentMethodSelection from "@/app/components/PaymentMethodSelection";
import InstantTopup from "@/app/components/InstantTopup";
import BankTransferModal from "@/app/components/BankTransferModal";
import TransactionHistory from "@/app/components/TransactionHistory";
import { getPlanById, rolloverPlan, activatePlan, InstantTransferDetails, BankTransferDetails } from "@/app/api/Plan";

// Define Plan type based on API
interface Plan {
  id: string;
  name: string;
  amount: number;
  status: "PENDING" | "ACTIVE" | "MATURED" | "CLOSED";
  maturityDate: string;
  createdAt: string;
  principal: number;
  currentPrincipal: number;
  duration: number;
  payoutFrequency: string;
  roiRate: number;
  roiType: string;
  rollover: boolean;
  rolloverType: "PRINCIPAL_ONLY" | "PRINCIPAL_AND_INTEREST";
  startDate: string;
  nextRoiDueAt: string | null;
  totalAccruedRoi: number;
}

export default function PlanDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showLiquidatePopup, setShowLiquidatePopup] = useState(false);
  const [showRolloverModal, setShowRolloverModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [rolloverEnabled, setRolloverEnabled] = useState(false);
  const [planId, setPlanId] = useState<string>("");
  const [pollingCount, setPollingCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [showPaymentMethodSelection, setShowPaymentMethodSelection] = useState(false);
  const [showInstantTransferPayment, setShowInstantTransferPayment] = useState(false);
  const [showBankTransferPayment, setShowBankTransferPayment] = useState(false);
  const [paymentInstantTransfer, setPaymentInstantTransfer] = useState<InstantTransferDetails | null>(null);
  const [paymentBankTransfer, setPaymentBankTransfer] = useState<BankTransferDetails | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Track initial values for comparison
  const initialStatusRef = useRef<string | null>(null);
  const initialPrincipalRef = useRef<number | null>(null);

  // Resolve plan ID from params
  useEffect(() => {
    const getPlanId = async () => {
      const resolved = await params;
      setPlanId(resolved.id);
    };
    getPlanId();
  }, [params]);

  // Fetch plan from API
  const fetchPlanData = async (id: string, isInitialLoad = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPlanById(id);
      const planData = response;

      if (!planData) throw new Error("Plan not found");

      const hasRollover =
        planData.rolloverType === "PRINCIPAL_ONLY" ||
        planData.rolloverType === "PRINCIPAL_AND_INTEREST";

      const mappedPlan: Plan = {
        id: planData.id,
        name: planData.name || "Unnamed Plan",
        amount: planData.principal || planData.currentPrincipal || 0,
        status: planData.status || "PENDING",
        maturityDate: planData.maturityDate || "",
        createdAt: planData.createdAt || "",
        principal: planData.principal || 0,
        currentPrincipal: planData.currentPrincipal || 0,
        duration: planData.duration || 0,
        payoutFrequency: planData.payoutFrequency || "MONTHLY",
        roiRate: planData.roiRate || 0,
        roiType: planData.roiType || "FIXED",
        rollover: hasRollover,
        rolloverType: planData.rolloverType || "PRINCIPAL_ONLY",
        startDate: planData.startDate || "",
        nextRoiDueAt: planData.nextRoiDueAt || null,
        totalAccruedRoi: planData.totalAccruedRoi || 0,
      };

      setPlan(mappedPlan);
      setRolloverEnabled(mappedPlan.rollover);

      // Store initial values on first load
      if (isInitialLoad) {
        initialStatusRef.current = mappedPlan.status;
        initialPrincipalRef.current = mappedPlan.currentPrincipal;

        // AUTO-START POLLING ONLY if plan is PENDING
        if (mappedPlan.status === "PENDING") {
          setIsPolling(true);
        } else {
          setIsPolling(false)
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load plan");
      setPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual function to start polling (for top-ups)
  const startPollingForUpdates = () => {
    setIsPolling(true);
    setPollingCount(0);
  };

  // Polling for plan updates
  useEffect(() => {
    if (!planId || !plan || !isPolling) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await getPlanById(planId);
        const planData = response;

        if (planData) {
          const statusChanged = planData.status !== plan.status;
          const currentPrincipalChanged =
            planData.currentPrincipal !== plan.currentPrincipal;

          if (statusChanged || currentPrincipalChanged) {
            const hasRollover =
              planData.rolloverType === "PRINCIPAL_ONLY" ||
              planData.rolloverType === "PRINCIPAL_AND_INTEREST";

            setPlan((prev) =>
              prev
                ? {
                    ...prev,
                    status: planData.status || prev.status,
                    currentPrincipal:
                      planData.currentPrincipal || prev.currentPrincipal,
                    amount:
                      planData.currentPrincipal ||
                      planData.principal ||
                      prev.amount,
                    rollover: hasRollover,
                    rolloverType: planData.rolloverType || prev.rolloverType,
                  }
                : null
            );
            setRolloverEnabled(hasRollover);

            // Stop polling conditions:
            // 1. If PENDING plan became ACTIVE
            // 2. If we detected a change (for top-ups)
            if (
              (plan.status === "PENDING" && planData.status === "ACTIVE") ||
              currentPrincipalChanged
            ) {
              setIsPolling(false);
              setPollingCount(0);
            }
          }

          setPollingCount((prev) => {
            const newCount = prev + 1;

            // Stop polling after max attempts
            const maxAttempts = plan.status === "PENDING" ? 60 : 12; // 5min for PENDING, 1min for top-ups

            if (newCount >= maxAttempts) {

              setIsPolling(false);
              return 0;
            }

            return newCount;
          });
        }
      } catch (err) {
        console.error("Polling failed", err);
        setPollingCount((prev) => prev + 1);
      }
    }, 5000); // Poll every 5 seconds

    return () => {

      clearInterval(intervalId);
    };
  }, [planId, plan, pollingCount, isPolling]);

  // Initial fetch
  useEffect(() => {
    if (planId) {
      fetchPlanData(planId, true);
    }
  }, [planId]);

  // Auto-rollover check for MATURED plans (after 7 days)
  useEffect(() => {
    if (!plan || plan.status !== "MATURED") return;

    const checkAutoRollover = async () => {
      try {
        const maturityDate = new Date(plan.maturityDate);
        const now = new Date();
        const daysSinceMaturity = Math.floor(
          (now.getTime() - maturityDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Auto-rollover after 7 days
        if (daysSinceMaturity >= 7) {
          try {
            // Default to PRINCIPAL_AND_INTEREST for auto-rollover
            const response = await rolloverPlan(planId, "PRINCIPAL_AND_INTEREST");
            
            // Refresh plan data
            fetchPlanData(planId, false);
          } catch (rolloverErr) {
            console.error("Auto-rollover API call failed:", rolloverErr);
          }
        }
      } catch (err) {
        console.error("Auto-rollover check failed:", err);
      }
    };

    const autoRolloverTimer = setTimeout(checkAutoRollover, 2000); // Check after 2 seconds
    return () => clearTimeout(autoRolloverTimer);
  }, [plan, planId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Handle "Make Payment" button for pending plans
  const handleMakePayment = async () => {
    if (!planId) return;

    setIsLoadingPayment(true);
    setPaymentError(null);

    try {
      // Call activatePlan to get payment options
      const paymentData = await activatePlan(planId);
      
      // Set payment data
      setPaymentInstantTransfer(paymentData.instantTransfer);
      setPaymentBankTransfer(paymentData.bankTransfer);
      
      // Show payment method selection modal
      setShowPaymentMethodSelection(true);
      
    } catch (err: any) {
      console.error("Failed to load payment details:", err);
      setPaymentError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load payment options. Please try again."
      );
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handleSelectInstantTransfer = () => {
    setShowPaymentMethodSelection(false);
    setShowInstantTransferPayment(true);
  };

  const handleSelectBankTransfer = () => {
    setShowPaymentMethodSelection(false);
    setShowBankTransferPayment(true);
  };

  const handleBackFromPayment = () => {
    setShowInstantTransferPayment(false);
    setShowBankTransferPayment(false);
    setShowPaymentMethodSelection(true);
  };

  if (isLoading)
    return (
      <main className="p-6 gap-6">
        <Link
          href="/dashboard/plans"
          className="flex items-center w-[90px] h-[42px] gap-1 text-sm text-[#37474F] mb-4"
        >
          <MdOutlineKeyboardArrowLeft />
          <p className="font-euclid">Back</p>
        </Link>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A243DC]"></div>
            <p className="text-gray-500">Loading plan details...</p>
          </div>
        </div>
      </main>
    );

  if (error || !plan)
    return (
      <main className="p-6 gap-6">
        <Link
          href="/dashboard/plans"
          className="flex items-center w-[90px] h-[42px] gap-1 text-sm text-[#37474F] mb-4"
        >
          <MdOutlineKeyboardArrowLeft />
          <p className="font-euclid">Back</p>
        </Link>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-red-600">{error || "Plan not found"}</p>
          <button
            onClick={() => router.push("/dashboard/plans")}
            className="px-4 py-2 bg-[#A243DC] text-white rounded-lg"
          >
            Back to Plans
          </button>
        </div>
      </main>
    );

  return (
    <main className="p-4 lg:p-6 gap-6 flex flex-col">
      <Link
        href="/dashboard/plans"
        className="flex items-center w-[90px] h-[42px] gap-1 text-sm text-[#37474F] mb-4"
      >
        <MdOutlineKeyboardArrowLeft />
        <p className="font-euclid">Back</p>
      </Link>

      {isPolling && plan.status === "PENDING" && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            <p className="text-sm">
              ⏳ Waiting for payment confirmation... This page will update
              automatically...
            </p>
          </div>
        </div>
      )}

      {/* Auto-Rollover status for MATURED plans */}
      {plan.status === "MATURED" && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <p className="text-sm">
            ℹ️ This plan has matured. After 7 days without action, it will be automatically rolled over.
          </p>
        </div>
      )}

      {/* LEFT & RIGHT CARDS */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-20">
        <div className="bg-[#F7F7F7] w-full lg:w-[557px] h-auto lg:h-[265px] p-6 rounded-xl shadow-sm">
          <h1 className="text-xl lg:text-2xl font-semibold font-freizeit flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-10">
            {plan.name}
            <span
              className={`text-xs px-3 font-manrope py-1 rounded-full ${
                plan.status === "ACTIVE"
                  ? "bg-blue-100 text-blue-600"
                  : plan.status === "MATURED"
                    ? "bg-green-100 text-green-800"
                    : plan.status === "CLOSED"
                      ? "bg-gray-300 text-gray-700"
                      : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {plan.status}
              {plan.status === "PENDING" && " ⏳"}
            </span>
          </h1>

          <p className="text-2xl lg:text-4xl font-bold mt-4">
            ₦{plan.currentPrincipal.toLocaleString()}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mt-6 flex-wrap">
            {plan.status === "PENDING" ? (
              <button
                onClick={handleMakePayment}
                disabled={isLoadingPayment}
                className="flex gap-2 items-center px-6 py-2 rounded-lg cursor-pointer bg-[#A243DC] text-white font-manrope disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingPayment ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Loading...
                  </>
                ) : (
                  <>
                    <FiArrowDownLeft size={20} />
                    <p>Make Payment</p>
                  </>
                )}
              </button>
            ) : plan.status === "CLOSED" ? (
              <div className="p-4 bg-gray-100 rounded-lg text-gray-600 text-sm">
                <p>This plan has been closed and withdrawn.</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (plan.status === "MATURED") {
                      setShowRolloverModal(true);
                    } else {
                      setShowTopUpModal(true);
                    }
                  }}
                  className="flex gap-2 items-center px-6 py-2 rounded-lg cursor-pointer bg-[#A243DC] text-white"
                >
                  <FiArrowDownLeft size={20} />
                  <p className="font-manrope">
                    {plan.status === "MATURED" ? "Rollover" : "Top-up"}
                  </p>
                </button>

                {plan.status === "ACTIVE" && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLiquidatePopup(true);
                    }}
                    className="border border-[#A243DC] text-[#A243DC] cursor-pointer flex items-center gap-2 text-center px-6 py-2 rounded-lg"
                  >
                    <FiArrowUpRight size={20} />
                    <p className="font-manrope">Liquidate</p>
                  </button>
                )}

                {plan.status === "MATURED" && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowWithdrawModal(true);
                    }}
                    className="border border-red-500 text-red-500 cursor-pointer flex items-center gap-2 text-center px-6 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FiArrowUpRight size={20} />
                    <p className="font-manrope">Withdraw All</p>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-[#F7F7F7] w-full lg:w-[350px] p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold font-freizeit text-[#A243DC] mb-4">
            Performance Summary
          </h3>

          <div className="space-y-2 lg:space-y-4 text-xs lg:text-sm">
            <div className="flex justify-between">
              <span className="font-euclid">Plan Created on</span>
              <span className="font-medium">{formatDate(plan.createdAt)}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-euclid">Plan Maturity Date</span>
              <span className="font-medium">
                {formatDate(plan.maturityDate)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-euclid">Amount Invested</span>
              <span className="font-medium">
                ₦{plan.principal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-euclid">Current Balance</span>
              <span className="font-medium">
                ₦{plan.currentPrincipal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-euclid">Interest Rate</span>
              <span className="font-medium">{plan.roiRate * 100}%</span>
            </div>

            <div className="flex justify-between">
              <span className="font-euclid">Total Accrued Returns</span>
              <span className="font-medium">
                ₦{plan.totalAccruedRoi.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-euclid">Rollover Type</span>
              <span className="font-medium">
                {plan.rolloverType?.replace("_", " ") || "Not set"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History - REPLACED with Real Component */}
      <div className="mt-6 w-full lg:w-[557px]">
        <TransactionHistory 
          planId={planId} // Pass planId to filter transactions
          isLoading={isLoading}
        />
      </div>

      {/* TopUp Modal - Pass the startPolling function */}
      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        planId={planId}
        onTopUpSuccess={startPollingForUpdates}
      />

      <ContinueLiquidate
        isOpen={showLiquidatePopup}
        onClose={() => setShowLiquidatePopup(false)}
        onConfirm={() => {
          // Refresh plan data after successful liquidation
          setTimeout(() => {
            fetchPlanData(planId, false);
            startPollingForUpdates();
          }, 500);
          setShowLiquidatePopup(false);
        }}
        planId={planId}
        planBalance={plan.currentPrincipal}
      />

      {/* Payment Method Selection Modal for Pending Plans */}
      {showPaymentMethodSelection && paymentInstantTransfer && paymentBankTransfer && (
        <PaymentMethodSelection
          isOpen={showPaymentMethodSelection}
          instantTransfer={paymentInstantTransfer}
          bankTransfer={paymentBankTransfer}
          onSelectInstant={handleSelectInstantTransfer}
          onSelectBank={handleSelectBankTransfer}
          onClose={handleBackFromPayment}
        />
      )}

      {/* Instant Transfer Modal for Pending Plans */}
      {showInstantTransferPayment && paymentInstantTransfer && (
        <InstantTopup
          isOpen={showInstantTransferPayment}
          instantTransfer={paymentInstantTransfer}
          planId={planId}
          onConfirm={() => {
            // Refresh plan data after successful payment
            fetchPlanData(planId, false);
            startPollingForUpdates();
          }}
          onBack={handleBackFromPayment}
        />
      )}

      {/* Bank Transfer Modal for Pending Plans */}
      {showBankTransferPayment && paymentBankTransfer && (
        <BankTransferModal
          isOpen={showBankTransferPayment}
          bankTransfer={paymentBankTransfer}
          planId={planId}
          onBack={handleBackFromPayment}
        />
      )}

      {/* Rollover Modal for Matured Plans */}
      {showRolloverModal && plan && (
        <RolloverModal
          isOpen={showRolloverModal}
          planId={planId}
          totalAccruedRoi={plan.totalAccruedRoi}
          principal={plan.principal}
          onClose={() => setShowRolloverModal(false)}
          onSuccess={(newPlanId: string) => {
            // Navigate to new plan after successful rollover
            router.push(`/dashboard/plans/${newPlanId}`);
          }}
        />
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && plan && (
        <WithdrawModal
          isOpen={showWithdrawModal}
          planId={planId}
          planName={plan.name}
          onClose={() => setShowWithdrawModal(false)}
          onWithdrawSuccess={() => {
            // Refresh plan data after successful withdrawal
            setTimeout(() => {
              fetchPlanData(planId, false);
              startPollingForUpdates();
            }, 500);
          }}
        />
      )}

      {/* Error message for payment loading */}
      {paymentError && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm">
            <h3 className="text-lg font-bold text-red-600 mb-4">Error</h3>
            <p className="text-gray-700 mb-6">{paymentError}</p>
            <button
              onClick={() => setPaymentError(null)}
              className="w-full px-4 py-2 bg-[#A243DC] text-white rounded-lg font-semibold hover:bg-[#8e3ac0] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}