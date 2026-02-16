"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Password from "./Password";
import { liquidatePlan, calculateLiquidationSummary, LiquidationSummary } from "@/app/api/Plan";

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
  const [liquidationSummary, setLiquidationSummary] = useState<LiquidationSummary | null>(null);

  const numericAmount = parseInt(amount.replace(/,/g, "")) || 0;

  // Load liquidation summary when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSummary();
    }
  }, [isOpen, planId, numericAmount, isFullLiquidation]);

  const loadSummary = async () => {
    setLoadingSummary(true);
    try {
      const response = await calculateLiquidationSummary(planId, numericAmount, isFullLiquidation);
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

  const handleConfirm = async () => {
    if (!agreeToTerms) {
      setError("Please agree to the terms & conditions");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log(`📤 Calling liquidate endpoint for plan ${planId}...`);
      
      const response = await liquidatePlan(planId, numericAmount, isFullLiquidation);
      
      console.log("✅ Liquidation initiated:", response);
      
      // Show password modal for PIN authorization
      // The ID is nested in data.intent.id
      const liquidationId = response?.data?.intent?.id || response?.data?.id || response?.id;
      console.log("Liquidation ID:", liquidationId);
      if (liquidationId) {
        setIntentId(liquidationId);
        setShowPassword(true);
      } else {
        console.error("Response structure:", response);
        throw new Error("No liquidation ID received from server");
      }
      
    } catch (err: any) {
      console.error("❌ Liquidation failed:", err);
      setError(err.response?.data?.message || err.message || "Failed to initiate liquidation. Please try again.");
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
          <p className="text-sm font-euclid text-gray-500">Amount to Liquidate</p>
          <p className="text-4xl font-bold font-freizeit text-gray-900">
            ₦{liquidationSummary?.liquidationAmount.toLocaleString() || amount}
          </p>
          {isFullLiquidation && (
            <p className="text-xs text-green-600 mt-1">Full Liquidation</p>
          )}
        </div>

        {/* Breakdown */}
        {liquidationSummary && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Amount to Liquidate</span>
                <span className="text-2xl font-bold text-gray-900">₦{liquidationSummary.liquidationAmount.toLocaleString()}</span>
              </div>
              
              {(liquidationSummary.roiPenalty > 0 || liquidationSummary.withholdingTax > 0) && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fees & Charges</span>
                  <span className="text-lg font-semibold text-red-600">-₦{(liquidationSummary.roiPenalty + liquidationSummary.withholdingTax).toLocaleString()}</span>
                </div>
              )}
              
              <div className="border-t border-yellow-300 pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">You Receive</span>
                <span className="text-2xl font-bold text-green-600">₦{liquidationSummary.netPayout.toLocaleString()}</span>
              </div>
            </div>
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
                {selectedAccount.accountNumber} • {selectedAccount.bankCode === "057" ? "Zenith Bank" : 
                 selectedAccount.bankCode === "044" ? "Access Bank" : 
                 `Bank Code: ${selectedAccount.bankCode}`}
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
        />
      </div>
    </div>
  );
}