"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Password from "./Password";
import {
  liquidatePlan,
  calculateLiquidationSummary,
  LiquidationSummary,
  IntentRespose,
  LiquidateResponse,
} from "@/app/api/Plan";
import { getUserProfileService } from "@/app/api/Users";

interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  createdAt: string;
}

export default function SummaryLiquidate({
  isOpen,
  onClose,
  amount,
  selectedAccount,
  planId,
  isFullLiquidation,
  onLiquidationSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  selectedAccount: BankAccount | null;
  planId: string;
  isFullLiquidation: boolean;
  onLiquidationSuccess: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [intentId, setIntentId] = useState<string>("");
  const [liquidationSummary, setLiquidationSummary] =
    useState<LiquidationSummary | null>(null);
  const [hasPin, setHasPin] = useState(true);

  const numericAmount = parseInt(amount.replace(/,/g, "")) || 0;

  // Helper function to format amounts to 2 decimal places
  const formatAmount = (value: number | undefined) => {
    if (value === undefined || value === null) return "0.00";
    return value.toFixed(2).toLocaleString();
  };

  // Check if user has PIN when modal opens
  useEffect(() => {
    const checkUserPin = async () => {
      try {
        const profile = await getUserProfileService();
        setHasPin(!!profile.data?.hasPin);
      } catch (err) {
        console.error("Failed to check PIN status:", err);
        setHasPin(false);
      }
    };

    if (isOpen) {
      checkUserPin();
      loadSummary();
    }
  }, [isOpen, planId, numericAmount, isFullLiquidation]);

  const loadSummary = async () => {
    setLoadingSummary(true);
    try {
      const response = await calculateLiquidationSummary(
        planId,
        numericAmount,
        isFullLiquidation,
      );
      console.log("📊 Liquidation Summary:", response.data);
      setLiquidationSummary(response.data);
    } catch (err: any) {
      console.error("❌ Failed to load summary:", err);
      setError("Failed to calculate liquidation summary. Please try again.");
    } finally {
      setLoadingSummary(false);
    }
  };

  if (!isOpen || !selectedAccount) return null;

  // In the handleConfirm function:

  const handleConfirm = async () => {
    if (!agreeToTerms) {
      setError("Please agree to the terms & conditions");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log(`📤 Calling liquidate endpoint for plan ${planId}...`);

      const response = await liquidatePlan(
        planId,
        numericAmount,
        isFullLiquidation,
      );

      console.log("✅ Liquidation initiated:", response);

      if (response.status === "AUTHORIZATION_REQUIRED") {
        const res = response as IntentRespose<LiquidateResponse>;
        const intentId = res.data.intent.id;

        console.log("Intent ID (for authorization):", intentId);

        if (intentId) {
          setIntentId(intentId);
          setShowPassword(true);
        }
      }
    } catch (err: any) {
      console.error("❌ Liquidation failed:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to initiate liquidation. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingSummary && isOpen) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm">
        <div className="bg-white w-[450px] rounded-2xl shadow-2xl relative p-8">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A243DC]"></div>
            <p className="text-gray-600">Calculating liquidation summary...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate fee breakdown for display
  const totalFees = liquidationSummary
    ? liquidationSummary.roiPenalty + liquidationSummary.withholdingTax
    : 0;

  const interestEarned = liquidationSummary
    ? liquidationSummary.proratedRoiAccrued
    : 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm">
      <div className="bg-white w-[450px] rounded-2xl shadow-2xl relative p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-center text-2xl font-euclid font-bold text-gray-900">
          Liquidation Summary
        </h2>

        {/* Liquidation Amount */}
        <div className="text-center mt-6">
          <p className="text-sm font-euclid text-gray-500">
            Amount to Liquidate
          </p>
          <p className="text-4xl font-bold font-freizeit text-gray-900">
            ₦
            {liquidationSummary
              ? formatAmount(liquidationSummary.liquidationAmount)
              : amount}
          </p>
          {isFullLiquidation && (
            <p className="text-xs text-green-600 mt-1">Full Liquidation</p>
          )}
        </div>

        {/* Breakdown - Clean and User Friendly */}
        {liquidationSummary && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4 space-y-3">
            {/* Principal Amount */}
            <div className="flex justify-between items-center text-gray-700">
              <span className="text-sm">Principal to withdraw</span>
              <span className="font-medium">
                ₦{formatAmount(liquidationSummary.liquidationAmount)}
              </span>
            </div>

            {/* Interest Earned */}
            {interestEarned > 0 && (
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-sm">Interest accrued on this amount</span>
                <span className="font-medium text-green-600">
                  +₦{formatAmount(interestEarned)}
                </span>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Fees Section */}
            {totalFees > 0 && (
              <>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="text-sm font-medium">Fees & Charges</span>
                  <span className="text-sm text-red-600">
                    -₦{formatAmount(totalFees)}
                  </span>
                </div>

                {/* Fee Breakdown */}
                <div className="pl-4 space-y-1">
                  {liquidationSummary.roiPenalty > 0 && (
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        Early liquidation penalty (
                        {liquidationSummary.roiPenaltyRate * 100}%)
                      </span>
                      <span>
                        -₦{formatAmount(liquidationSummary.roiPenalty)}
                      </span>
                    </div>
                  )}
                  {liquidationSummary.withholdingTax > 0 && (
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        Withholding tax (
                        {liquidationSummary.withholdingTaxRate * 100}%)
                      </span>
                      <span>
                        -₦{formatAmount(liquidationSummary.withholdingTax)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 my-2"></div>
              </>
            )}

            {/* You Receive */}
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-800">
                You receive
              </span>
              <span className="text-2xl font-bold text-green-600">
                ₦{formatAmount(liquidationSummary.netPayout)}
              </span>
            </div>

            {/* Info Note */}
            <p className="text-xs text-gray-500 mt-2 italic">
              Fees are applied only to the interest earned on the amount you're
              liquidating.
            </p>
          </div>
        )}

        {/* Destination Account */}
        <div className="mt-8">
          <p className="text-sm text-center font-euclid text-gray-500 mb-4">
            Destination Account
          </p>

          <div className="flex items-center bg-[#F2F4F5] justify-center gap-3 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
              <Image
                src="/bank-icon.svg"
                alt={selectedAccount.bankCode}
                width={24}
                height={24}
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {selectedAccount.accountName}
              </p>
              <p className="text-sm text-gray-600">
                {selectedAccount.accountNumber} •{" "}
                {selectedAccount.bankCode === "057"
                  ? "Zenith Bank"
                  : selectedAccount.bankCode === "044"
                    ? "Access Bank"
                    : `Bank Code: ${selectedAccount.bankCode}`}
              </p>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex justify-between items-center gap-2 mt-6">
          <p className="text-sm font-euclid text-gray-700">
            Agree to early liquidation terms <br />& conditions
          </p>
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={agreeToTerms}
            onChange={(e) => {
              setAgreeToTerms(e.target.checked);
              setError("");
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="w-1/2 border border-[#A243DC] text-[#A243DC] py-3 font-manrope rounded-xl hover:bg-purple-50 transition-colors"
            disabled={loading}
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !agreeToTerms}
            className={`w-1/2 py-3 font-manrope rounded-xl transition-colors ${
              loading || !agreeToTerms
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#A243DC] text-white hover:bg-[#8e3ac0]"
            }`}
          >
            {loading ? "Processing..." : success ? "✓ Liquidated" : "Confirm"}
          </button>
        </div>

        {/* Password Modal for Authorization */}
        <Password
          isOpen={showPassword}
          onClose={() => setShowPassword(false)}
          intentId={intentId}
          onAuthorizationSuccess={() => {
            setShowPassword(false);
            setSuccess(true);
            setTimeout(() => {
              onClose();
              onLiquidationSuccess();
            }, 1000);
          }}
          hasPin={hasPin}
        />
      </div>
    </div>
  );
}
