"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { withdrawPlan } from "@/app/api/Plan";
import toast from "react-hot-toast";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  onWithdrawSuccess?: () => void;
}

export default function WithdrawModal({
  isOpen,
  onClose,
  planId,
  planName,
  onWithdrawSuccess,
}: WithdrawModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleConfirmWithdraw = async () => {
    if (!agreeToTerms) {
      setError("Please agree to the terms & conditions");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {


      const response = await withdrawPlan(planId);

      // Withdrawal completed successfully
      toast.success(
        "Plan closed successfully. All remaining funds have been withdrawn.",
      );
      onClose();
      if (onWithdrawSuccess) {
        onWithdrawSuccess();
      }
    } catch (err: any) {
      // Only show error if it's actually an error
      if (err.response?.status !== 200) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to withdraw plan. Please try again.",
        );
      } else {
        // If status is 200 but we're in catch block, it's a parsing issue - still success

        onClose();
        if (onWithdrawSuccess) {
          onWithdrawSuccess();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm p-4">
      <div className="bg-white w-full lg:w-[500px] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-screen lg:max-h-auto overflow-y-auto lg:overflow-y-visible">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors z-10"
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        {/* Header Section */}
        <div className="pt-8 pb-4 text-center">
          <h2 className="text-2xl font-bold font-euclid text-gray-900">
            Close Plan
          </h2>
          <p className="text-sm font-medium font-manrope text-gray-500 mt-2">
            {planName}
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Warning Message */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="text-red-600 shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Important</h3>
              <p className="text-sm text-red-700 leading-relaxed">
                This action will permanently close this investment plan and
                withdraw all remaining principal and accrued interest. This
                cannot be undone.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Agreement Checkbox */}
          <div className="mb-6 flex items-start gap-3">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agreeToTerms}
              onChange={(e) => {
                setAgreeToTerms(e.target.checked);
                if (e.target.checked) setError(null);
              }}
              className="w-4 h-4 mt-1 accent-[#A243DC] cursor-pointer"
            />
            <label
              htmlFor="agree-terms"
              className="text-sm text-gray-700 font-medium"
            >
              I understand that closing this plan is permanent and all funds
              will be withdrawn to my bank account.
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmWithdraw}
              disabled={isLoading || !agreeToTerms}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Processing...
                </>
              ) : (
                "Close Plan & Withdraw"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
