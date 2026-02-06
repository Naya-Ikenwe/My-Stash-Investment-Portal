"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Password from "./Password";
import { liquidatePlanService } from "@/app/api/Users";

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
  const [error, setError] = useState<string>("");
  const [intentId, setIntentId] = useState<string>("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  if (!isOpen || !selectedAccount) return null;

  const numericAmount = parseInt(amount.replace(/,/g, "")) || 0;
  const breakingFee = isFullLiquidation ? 0 : numericAmount * 0.01; // 1% fee for partial liquidation
  const netAmount = numericAmount - breakingFee;

  const handleConfirm = async () => {
    if (!agreeToTerms) {
      setError("Please agree to the terms & conditions");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call liquidation API
      const response = await liquidatePlanService(planId, {
        amount: numericAmount,
        isFull: isFullLiquidation,
      });

      if (response.data?.intent?.id) {
        setIntentId(response.data.intent.id);
        setShowPassword(true);
      } else {
        throw new Error("No intent ID received from server");
      }
    } catch (err: any) {
      console.error("Liquidation failed:", err);
      setError(err.response?.data?.message || "Failed to initiate liquidation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm">
      <div className="bg-white w-[450px] rounded-2xl shadow-2xl relative p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-center text-2xl font-euclid font-bold text-gray-900">
          Summary
        </h2>

        {/* Amount */}
        <div className="text-center mt-6">
          <p className="text-sm font-euclid text-gray-500">Amount</p>
          <p className="text-4xl font-bold font-freizeit text-gray-900">₦{amount}</p>
          {isFullLiquidation && (
            <p className="text-xs text-green-600 mt-1">Full Liquidation</p>
          )}
        </div>

        {/* Breaking Fee (only for partial liquidation) */}
        {!isFullLiquidation && breakingFee > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm font-euclid text-gray-500">
              Breaking Fee (1%)
            </p>
            <p className="text-lg font-semibold text-red-600">
              -₦{breakingFee.toLocaleString()}
            </p>
          </div>
        )}

        {/* Net Amount */}
        <div className="mt-4 text-center">
          <p className="text-sm font-euclid text-gray-500">
            Net Amount You Receive
          </p>
          <p className="text-2xl font-bold text-green-600">
            ₦{netAmount.toLocaleString()}
          </p>
        </div>

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
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>

        {/* Password Modal */}
        <Password
          isOpen={showPassword}
          onClose={() => setShowPassword(false)}
          intentId={intentId}
          onAuthorizationSuccess={() => {
            setShowPassword(false);
            onClose();
            onLiquidationSuccess();
          }}
        />
      </div>
    </div>
  );
}