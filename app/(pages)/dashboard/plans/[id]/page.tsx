"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import TopUpModal from "@/app/components/TopupModal";
import LiquidatePopup from "@/app/components/LiquidatePopup";
import { getPlanById } from "@/app/api/Plan";

// Define Plan type based on API
interface Plan {
  id: string;
  name: string;
  amount: number;
  status: "PENDING" | "ACTIVE" | "MATURED";
  maturityDate: string;
  createdAt: string;
  principal: number;
  currentPrincipal: number;
  duration: number;
  payoutFrequency: string;
  roiRate: number;
  roiType: string;
  rollover: boolean; // Local toggle until API endpoint exists
  rolloverType: "PRINCIPAL_ONLY" | "PRINCIPAL_AND_INTEREST";
  startDate: string;
  nextRoiDueAt: string | null;
  totalAccruedRoi: number;
}

// Mock transactions (replace with real API later)
const mockTransactions = [
  { id: 1, type: "deposit" as const, date: "2025-01-30", amount: 20000 },
  { id: 2, type: "interest" as const, date: "2025-02-28", amount: 200 },
];

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
  const [rolloverEnabled, setRolloverEnabled] = useState(false);
  const [planId, setPlanId] = useState<string>("");
  const [pollingCount, setPollingCount] = useState(0);

  // Resolve plan ID from params
  useEffect(() => {
    const getPlanId = async () => {
      const resolved = await params;
      setPlanId(resolved.id);
    };
    getPlanId();
  }, [params]);

  // Fetch plan from API
  const fetchPlanData = async (id: string) => {
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
    } catch (err: any) {
      setError(err.message || "Failed to load plan");
      setPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll PENDING plans
  useEffect(() => {
    if (!planId || !plan || plan.status !== "PENDING") return;

    const intervalId = setInterval(async () => {
      try {
        const response = await getPlanById(planId);
        const planData = response;

        if (planData?.status === "ACTIVE") {
          const hasRollover =
            planData.rolloverType === "PRINCIPAL_ONLY" ||
            planData.rolloverType === "PRINCIPAL_AND_INTEREST";

          setPlan((prev) =>
            prev
              ? {
                  ...prev,
                  status: "ACTIVE",
                  rollover: hasRollover,
                  rolloverType: planData.rolloverType || "PRINCIPAL_ONLY",
                }
              : null
          );
          setRolloverEnabled(hasRollover);
          setPollingCount(0);
        } else {
          setPollingCount((prev) => prev + 1);
          if (pollingCount >= 60) setPollingCount(0);
        }
      } catch (err) {
        console.error("Polling failed", err);
        setPollingCount((prev) => prev + 1);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [planId, plan, pollingCount]);

  useEffect(() => {
    if (planId) fetchPlanData(planId);
  }, [planId]);

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
    <main className="p-6 gap-6">
      <Link
        href="/dashboard/plans"
        className="flex items-center w-[90px] h-[42px] gap-1 text-sm text-[#37474F] mb-4"
      >
        <MdOutlineKeyboardArrowLeft />
        <p className="font-euclid">Back</p>
      </Link>

      {plan.status === "PENDING" && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            <p className="text-sm">
              ⏳ Waiting for payment confirmation. This page will update
              automatically...
            </p>
          </div>
        </div>
      )}

      {/* LEFT & RIGHT CARDS */}
      <div className="flex gap-20">
        <div className="bg-[#F7F7F7] w-[557px] h-[265px] p-6 rounded-xl shadow-sm">
          <h1 className="text-2xl font-semibold font-freizeit flex items-center gap-10">
            {plan.name}
            <span
              className={`text-xs px-3 font-manrope py-1 rounded-full ${
                plan.status === "ACTIVE"
                  ? "bg-blue-100 text-blue-600"
                  : plan.status === "MATURED"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {plan.status}
              {plan.status === "PENDING" && " ⏳"}
            </span>
          </h1>

          <p className="text-4xl font-bold mt-4">₦{plan.amount.toLocaleString()}</p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setShowTopUpModal(true)}
              disabled={plan.status === "PENDING"}
              className={`flex gap-2 items-center px-6 py-2 rounded-lg cursor-pointer ${
                plan.status === "PENDING"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#A243DC] text-white"
              }`}
            >
              <FiArrowDownLeft size={20} />
              <p className="font-manrope">
                {plan.status === "MATURED" ? "Rollover" : "Top-up"}
              </p>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                setShowLiquidatePopup(true);
              }}
              disabled={plan.status === "PENDING"}
              className={`border flex items-center gap-2 text-center px-6 py-2 rounded-lg ${
                plan.status === "PENDING"
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-[#A243DC] text-[#A243DC] cursor-pointer"
              }`}
            >
              <FiArrowUpRight size={20} />
              <p className="font-manrope">Liquidate</p>
            </button>
          </div>

          {/* Rollover toggle */}
          <div className="flex justify-between mt-6 items-center">
            <span className="text-gray-700 font-euclid">Reinvest after maturity</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={rolloverEnabled}
                disabled={plan.status === "PENDING"}
                onChange={(e) => setRolloverEnabled(e.target.checked)}
              />
              <div
                className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  plan.status === "PENDING"
                    ? "bg-gray-200 peer-checked:bg-gray-400 after:border-gray-300"
                    : "bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A243DC] peer-checked:bg-[#A243DC] after:border-gray-300"
                }`}
              ></div>
            </label>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-[#F7F7F7] w-[350px] p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold font-freizeit text-[#A243DC] mb-4">
            Performance Summary
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="font-euclid">Plan Created on</span>
              <span className="font-medium">{formatDate(plan.createdAt)}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-euclid">Plan Maturity Date</span>
              <span className="font-medium">{formatDate(plan.maturityDate)}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-euclid">Amount Invested</span>
              <span className="font-medium">₦{plan.principal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-euclid">Current Balance</span>
              <span className="font-medium">₦{plan.currentPrincipal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-euclid">Interest Rate</span>
              <span className="font-medium">{plan.roiRate * 100}%</span>
            </div>

            <div className="flex justify-between">
              <span className="font-euclid">Total Accrued Returns</span>
              <span className="font-medium">₦{plan.totalAccruedRoi.toLocaleString()}</span>
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

      {/* Transaction History */}
      <div className="bg-[#F7F7F7] p-6 rounded-xl shadow-sm w-[557px] mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold font-freizeit text-[#303437]">Transaction History</h3>
          <Link href="#" className="text-sm flex items-center gap-2 text-[#303437] hover:underline">
            <p className="font-manrope">View all</p>
            <IoIosArrowForward />
          </Link>
        </div>

        <div className="space-y-4">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={tx.type === "deposit" ? "/manual.svg" : "/interest.svg"}
                  alt={tx.type}
                  width={32}
                  height={32}
                />
                <div>
                  <p className="font-medium font-euclid capitalize">
                    {tx.type === "deposit" ? "Manual Deposit" : "Interest Payment"}
                  </p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₦{tx.amount.toLocaleString()}</p>
                <p className="text-xs text-green-600">Successful</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TopUpModal isOpen={showTopUpModal} onClose={() => setShowTopUpModal(false)} />
      <LiquidatePopup
        isOpen={showLiquidatePopup}
        onClose={() => setShowLiquidatePopup(false)}
        planStatus={plan.status}
      />
    </main>
  );
}
