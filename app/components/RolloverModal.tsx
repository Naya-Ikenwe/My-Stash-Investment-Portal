"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { rolloverPlan } from "../api/Plan";

interface RolloverModalProps {
  isOpen: boolean;
  planId: string;
  totalAccruedRoi: number;
  principal: number;
  onClose: () => void;
  onSuccess?: (newPlanId: string) => void;
}

export default function RolloverModal({
  isOpen,
  planId,
  totalAccruedRoi,
  principal,
  onClose,
  onSuccess,
}: RolloverModalProps) {
  const [selectedOption, setSelectedOption] =
    useState<"PRINCIPAL_ONLY" | "PRINCIPAL_AND_INTEREST">("PRINCIPAL_ONLY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRollover = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await rolloverPlan(planId, selectedOption);

      const newPlanId = response.data?.plan?.id || response.data?.id;

      console.log("✅ Rollover successful - New Plan ID:", newPlanId);

      // Show success message
      alert(
        `✅ Plan rolled over successfully!\n\n${
          selectedOption === "PRINCIPAL_AND_INTEREST"
            ? `Your interest of ₦${totalAccruedRoi.toLocaleString()} has been reinvested.`
            : `Your interest of ₦${totalAccruedRoi.toLocaleString()} has been withdrawn.`
        }`
      );

      onClose();

      // Pass new plan ID to callback for navigation
      if (onSuccess && newPlanId) {
        onSuccess(newPlanId);
      }
    } catch (err: any) {
      // Check if the error is just a response parsing issue but rollover was successful
      if (err.response?.status === 200 || err.response?.status === 201) {
        const newPlanId = err.response?.data?.plan?.id || err.response?.data?.id;
        
        console.log("✅ Rollover completed - New Plan ID:", newPlanId);
        
        alert(
          `✅ Plan rolled over successfully!\n\n${
            selectedOption === "PRINCIPAL_AND_INTEREST"
              ? `Your interest of ₦${totalAccruedRoi.toLocaleString()} has been reinvested.`
              : `Your interest of ₦${totalAccruedRoi.toLocaleString()} has been withdrawn.`
          }`
        );
        onClose();
        if (onSuccess && newPlanId) {
          onSuccess(newPlanId);
        }
        return;
      }

      console.error("❌ Rollover failed:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to rollover plan. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const newPrincipalWithInterest = principal + totalAccruedRoi;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm">
      <div className="bg-white w-[600px] rounded-2xl shadow-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Rollover Your Plan
          </h2>
          <p className="text-gray-600">
            Your plan has matured. Choose how you want to proceed.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {/* Option 1: Principal + Interest */}
          <div
            onClick={() => setSelectedOption("PRINCIPAL_AND_INTEREST")}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedOption === "PRINCIPAL_AND_INTEREST"
                ? "border-[#A243DC] bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                  selectedOption === "PRINCIPAL_AND_INTEREST"
                    ? "border-[#A243DC] bg-[#A243DC]"
                    : "border-gray-300"
                }`}
              >
                {selectedOption === "PRINCIPAL_AND_INTEREST" && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">
                  Reinvest Everything
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Reinvest both your principal and earned interest into a new plan
                </p>
                <div className="bg-white rounded p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal:</span>
                    <span className="font-semibold text-gray-900">
                      ₦{principal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Earned:</span>
                    <span className="font-semibold text-[#44C56F]">
                      +₦{totalAccruedRoi.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Total to Invest:</span>
                    <span className="font-bold text-[#A243DC]">
                      ₦{newPrincipalWithInterest.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Option 2: Principal Only */}
          <div
            onClick={() => setSelectedOption("PRINCIPAL_ONLY")}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedOption === "PRINCIPAL_ONLY"
                ? "border-[#A243DC] bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                  selectedOption === "PRINCIPAL_ONLY"
                    ? "border-[#A243DC] bg-[#A243DC]"
                    : "border-gray-300"
                }`}
              >
                {selectedOption === "PRINCIPAL_ONLY" && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">
                  Withdraw Interest & Reinvest Principal
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Withdraw your interest earnings and reinvest only your principal
                </p>
                <div className="bg-white rounded p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal to Reinvest:</span>
                    <span className="font-semibold text-gray-900">
                      ₦{principal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest to Withdraw:</span>
                    <span className="font-semibold text-[#44C56F]">
                      ₦{totalAccruedRoi.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRollover}
            disabled={isSubmitting}
            className="flex-1 bg-[#A243DC] text-white py-3 rounded-lg font-semibold hover:bg-[#8e3ac0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Processing...
              </>
            ) : (
              "Confirm Rollover"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
