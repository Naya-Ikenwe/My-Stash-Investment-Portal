"use client";

import React, { useState } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import PaymentMethodSelection from "./PaymentMethodSelection";
import InstantTopup from "./InstantTopup";
import BankTransferModal from "./BankTransferModal";
import { topUpPlan, InstantTransferDetails, BankTransferDetails } from "@/app/api/Plan";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  onTopUpSuccess?: () => void;
}

export default function TopUpModal({
  isOpen,
  onClose,
  planId,
  onTopUpSuccess,
}: TopUpModalProps) {
  const [amount, setAmount] = useState("120,000");
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showInstantTransfer, setShowInstantTransfer] = useState(false);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [instantTransfer, setInstantTransfer] = useState<InstantTransferDetails | null>(null);
  const [bankTransfer, setBankTransfer] = useState<BankTransferDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!planId) {
      setError("Plan ID is missing");
      return;
    }

    const numericAmount = parseInt(amount.replace(/,/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`📤 Calling top-up endpoint for plan ${planId} with amount ${numericAmount}`);
      
      const response = await topUpPlan(planId, numericAmount);
      
      console.log("✅ Top-up API response:", response);
      
      setInstantTransfer(response.data.payment.instantTransfer);
      setBankTransfer(response.data.payment.bankTransfer);
      setShowPaymentMethods(true);
      
    } catch (err: any) {
      console.error("❌ Top-up failed:", err);
      setError(err.message || "Failed to initiate top-up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectInstant = () => {
    setShowPaymentMethods(false);
    setShowInstantTransfer(true);
  };

  const handleSelectBank = () => {
    setShowPaymentMethods(false);
    setShowBankTransfer(true);
  };

  const handleBackFromPayment = () => {
    setShowInstantTransfer(false);
    setShowBankTransfer(false);
    setShowPaymentMethods(true);
  };

  const handlePaymentSuccess = () => {
    onClose();
    if (onTopUpSuccess) {
      onTopUpSuccess();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Top-up Modal */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white w-[450px] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>

          {/* Header Section */}
          <div className="pt-8 pb-4 text-center">
            <h2 className="text-xl font-bold font-euclid text-gray-900">Top Up Plan</h2>
            <p className="text-xs font-medium font-manrope text-gray-500 uppercase mt-1">
              Add Funds • NGN
            </p>
          </div>

          {/* Content Padding */}
          <div className="px-8 pb-8">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Amount Input Section */}
            <div className="flex flex-col items-center mb-8">
              <label className="text-sm text-gray-500 font-manrope mb-3">Amount</label>

              {/* Currency Pill */}
              <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-full mb-2">
                <div className="flex items-center justify-center overflow-hidden rounded-full border border-black/10">
                  <Image
                    src="/flag.svg"
                    alt="NGN"
                    width={20}
                    height={20}
                    className="object-cover w-5 h-5"
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">NGN</span>
              </button>

              {/* Large Input */}
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9,]/g, '');
                  setAmount(value);
                }}
                disabled={isLoading}
                className="w-full text-center text-4xl font-bold text-gray-900 focus:outline-none placeholder-gray-300"
                placeholder="0"
              />
              <hr className="border border-[#455A6433] w-full mt-5" />
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end">
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="w-auto px-8 py-3 bg-[#A243DC] hover:bg-[#8e3ac0] text-white font-euclid font-medium rounded-xl transition-colors shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Processing...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection Modal */}
      {showPaymentMethods && instantTransfer && bankTransfer && (
        <PaymentMethodSelection
          isOpen={showPaymentMethods}
          instantTransfer={instantTransfer}
          bankTransfer={bankTransfer}
          onSelectInstant={handleSelectInstant}
          onSelectBank={handleSelectBank}
          onClose={onClose}
        />
      )}

      {/* Instant Transfer Modal */}
      {showInstantTransfer && instantTransfer && (
        <InstantTopup
          isOpen={showInstantTransfer}
          instantTransfer={instantTransfer}
          planId={planId}
          onConfirm={handlePaymentSuccess}
          onBack={handleBackFromPayment}
          isTopUp={true}
        />
      )}

      {/* Bank Transfer Modal */}
      {showBankTransfer && bankTransfer && (
        <BankTransferModal
          isOpen={showBankTransfer}
          bankTransfer={bankTransfer}
          planId={planId}
          onBack={handleBackFromPayment}
        />
      )}
    </>
  );
}