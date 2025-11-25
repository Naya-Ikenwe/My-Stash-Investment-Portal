"use client";

import React from "react";
import { X, Copy, Mail } from "lucide-react";

export default function BankTopup({
  isOpen,
  amount,
  onConfirm,
  onBack,
}: {
  isOpen: boolean;
  amount: string;
  method?: string; // Optional, kept to prevent breaking parent component
  onConfirm: () => void;
  onBack: () => void;
}) {
  if (!isOpen) return null;

  // Copy to clipboard helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!"); // You can replace this with a toast notification
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm">
      <div className="bg-white w-[500px] rounded-3xl shadow-2xl p-10 relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={onBack}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-10 mt-2">
          <h3 className="text-lg font-medium text-gray-800">
            Make a bank transfer to our account below
          </h3>
        </div>

        {/* Details List */}
        <div className="space-y-6 mb-8">
          {/* Row 1: Amount */}
          <div className="flex justify-between items-center">
            <span className="text-base text-gray-500 font-medium">Amount</span>
            <div className="flex items-center gap-2">
              <span className="text-[#A243DC] font-bold text-lg">
                ₦{amount}
              </span>
              <button
                onClick={() => handleCopy(amount)}
                className="text-[#A243DC] hover:text-[#8e3ac0] transition-colors"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          {/* Row 2: Bank */}
          <div className="flex justify-between items-center">
            <span className="text-base text-gray-500 font-medium">Bank</span>
            <span className="text-gray-900 font-medium text-lg">
              Source MFB
            </span>
          </div>

          {/* Row 3: Bank Name */}
          <div className="flex justify-between items-center">
            <span className="text-base text-gray-500 font-medium">
              Bank Name
            </span>
            <span className="text-gray-900 font-medium text-lg">
              myStash Investment
            </span>
          </div>

          {/* Row 4: Account Number */}
          <div className="flex justify-between items-center">
            <span className="text-base text-gray-500 font-medium">
              Account Number
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#A243DC] font-bold text-lg">
                5065244473
              </span>
              <button
                onClick={() => handleCopy("5065244473")}
                className="text-[#A243DC] hover:text-[#8e3ac0] transition-colors"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Email Instruction Note */}
        <div className="flex gap-3 mb-8 items-start">
          <Mail size={20} className="text-[#A243DC] shrink-0 mt-0.5" />
          <p className="text-sm text-[#37474F]">
            After payment, kindly send your receipt to
            investment@princepsfinance.com for confirmation.
          </p>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="px-10 py-3 bg-[#A243DC] hover:bg-[#8e3ac0] text-white font-medium rounded-xl transition-colors shadow-lg shadow-purple-100"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
