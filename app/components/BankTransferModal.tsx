"use client";

import React from "react";
import { X, Copy, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { BankTransferDetails } from "../api/Plan";

interface BankTransferModalProps {
  isOpen: boolean;
  bankTransfer: BankTransferDetails;
  planId: string;
  onBack: () => void;
}

export default function BankTransferModal({
  isOpen,
  bankTransfer,
  planId,
  onBack,
}: BankTransferModalProps) {
  const router = useRouter();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy");
    }
  };

  const handleConfirmPayment = () => {

    onBack();
    router.push(`/dashboard/plans/${planId}`);
  };

  if (!isOpen) return null;

  const displayAmount = bankTransfer.amount
    ? `₦${bankTransfer.amount.toLocaleString()}`
    : "₦0";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm p-4">
      <div className="bg-white w-full lg:w-[450px] rounded-2xl shadow-2xl p-6 lg:p-8 relative flex flex-col max-h-screen lg:max-h-auto overflow-y-auto lg:overflow-y-visible">
        <button
          onClick={onBack}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mt-2 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Bank Transfer Details</h2>
          <p className="text-gray-600 text-sm mt-2">
            Transfer the amount below to complete your payment
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-500">Amount to Transfer</span>
            <div className="flex items-center gap-2">
              <span className="text-[#44C56F] font-bold text-lg">{displayAmount}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopy(bankTransfer.amount?.toString() || "");
                }}
                className="text-gray-400 hover:text-[#44C56F] transition-colors cursor-pointer"
                title="Copy amount"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Bank Name</span>
            <span className="text-gray-900 font-semibold">{bankTransfer.bankName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Account Name</span>
            <span className="text-gray-900 font-semibold">{bankTransfer.bankAccountName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Account Number</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-mono font-semibold text-sm">
                {bankTransfer.bankAccountNumber}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopy(bankTransfer.bankAccountNumber);
                }}
                className="text-gray-400 hover:text-[#44C56F] transition-colors cursor-pointer"
                title="Copy account number"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Payment Reference</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-mono text-xs">
                {bankTransfer.reference}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopy(bankTransfer.reference);
                }}
                className="text-gray-400 hover:text-[#44C56F] transition-colors cursor-pointer"
                title="Copy reference"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 items-start bg-blue-50 p-4 rounded-lg">
            <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 font-medium leading-relaxed">
              Please include the payment reference when making the transfer. It helps us identify your payment faster.
            </p>
          </div>

          <div className="flex gap-3 items-start bg-green-50 p-4 rounded-lg">
            <AlertCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
            <p className="text-xs text-green-700 font-medium leading-relaxed">
              No service fee for bank transfers. You'll only pay {displayAmount}.
            </p>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Change Method
          </button>
          <button
            onClick={handleConfirmPayment}
            className="flex-1 bg-[#44C56F] hover:bg-[#38a055] text-white py-3 rounded-lg font-semibold transition-colors"
          >
            I have transferred
          </button>
        </div>
      </div>
    </div>
  );
}