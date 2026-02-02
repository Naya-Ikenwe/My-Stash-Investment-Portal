"use client";

import React, { useState } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import InstantTopup from "./InstantTopup";
import BankTopup from "./BankTopup";
import { topUpPlan } from "@/app/api/Plan";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  onTopUpSuccess?: () => void; // NEW: Callback for successful top-up
}

interface PaymentDetails {
  bankAccountNumber: string;
  bankName: string;
  channel: string;
  expiresIn: string;
  bankAccountName: string;
  amountToPay: number;
  reference: string;
}

export default function TopUpModal({
  isOpen,
  onClose,
  planId,
  onTopUpSuccess, // NEW: Accept callback
}: TopUpModalProps) {
  const [amount, setAmount] = useState("120,000");
  const [selectedBank, setSelectedBank] = useState("instant");
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!planId) {
      setError("Plan ID is missing");
      return;
    }

    // Convert formatted amount to number (remove commas)
    const numericAmount = parseInt(amount.replace(/,/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`📤 Calling top-up endpoint for plan ${planId} with amount ${numericAmount}`);
      
      // Call the top-up API endpoint
      const response = await topUpPlan(planId, numericAmount);
      
      console.log("✅ Top-up API response:", response);
      
      // Store payment details from response
      setPaymentDetails(response.data.payment);
      setShowConfirmation(true);
      
    } catch (err: any) {
      console.error("❌ Top-up failed:", err);
      setError(err.message || "Failed to initiate top-up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setPaymentDetails(null);
    onClose(); // Close the main modal too
  };

  const handlePaymentConfirmed = () => {
    console.log("✅ Top-up payment confirmed via InstantTopup");
    
    // Call the success callback to start polling in PlanDetails
    if (onTopUpSuccess) {
      console.log("🎯 Calling onTopUpSuccess callback to start polling");
      onTopUpSuccess();
    }
    
    // Close the confirmation modal
    handleConfirmationClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      {/* Modal Container */}
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
                // Allow only numbers and commas
                const value = e.target.value.replace(/[^0-9,]/g, '');
                setAmount(value);
              }}
              disabled={isLoading}
              className="w-full text-center text-4xl font-bold text-gray-900 focus:outline-none placeholder-gray-300"
              placeholder="0"
            />
            <hr className="border border-[#455A6433] w-full mt-5" />
          </div>

          {/* Funding Source Section */}
          <div className="mb-8">
            <p className="text-center font-euclid text-sm text-gray-500 mb-3">
              Funding Source
            </p>

            {/* Clickable Header */}
            <div
              onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
              className={`
                border border-gray-200 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-all select-none
                ${isDropdownOpen ? "rounded-t-xl border-b-0" : "rounded-xl"}
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <span className="text-sm font-medium text-gray-700">
                {selectedBank === "instant"
                  ? "Instant Transfer"
                  : "Bank Transfer"}
              </span>
              {/* Icon rotates when open/closed */}
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {/* Dropdown Content (Only shows if isDropdownOpen is true) */}
            {isDropdownOpen && (
              <div className="border border-gray-200 border-t-0 rounded-b-xl p-3 space-y-2 bg-white">
                {/* Option 1: Instant Transfer */}
                <div
                  onClick={() => !isLoading && setSelectedBank("instant")}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all ${
                    selectedBank === "instant"
                      ? "bg-purple-50 border-purple-200"
                      : "bg-gray-50 border-transparent hover:bg-gray-100"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-euclid font-semibold text-gray-800">
                        Instant Transfer
                      </span>
                    </div>
                  </div>
                  {selectedBank === "instant" && (
                    <div className="bg-yellow-400 rounded-full p-0.5">
                      <Check size={12} className="text-white" strokeWidth={4} />
                    </div>
                  )}
                </div>

                {/* Option 2: Bank Transfer */}
                <div
                  onClick={() => !isLoading && setSelectedBank("bank")}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all ${
                    selectedBank === "bank"
                      ? "bg-purple-50 border-purple-200"
                      : "bg-white border-transparent hover:bg-gray-50"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-euclid font-semibold text-gray-800">
                        Bank Transfer
                      </span>
                    </div>
                  </div>
                  {selectedBank === "bank" && (
                    <div className="bg-yellow-400 rounded-full p-0.5">
                      <Check size={12} className="text-white" strokeWidth={4} />
                    </div>
                  )}
                </div>
              </div>
            )}
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

        {/* InstantTopup Modal for Top-up */}
        {showConfirmation && paymentDetails && (
          <InstantTopup
            isOpen={showConfirmation}
            paymentDetails={paymentDetails}
            planId={planId}
            onConfirm={handlePaymentConfirmed} // UPDATED: Use the new handler
            onBack={handleConfirmationClose}
            isTopUp={true}
          />
        )}

        {/* Note: BankTopup might need similar updates if you use it */}
      </div>
    </div>
  );
}