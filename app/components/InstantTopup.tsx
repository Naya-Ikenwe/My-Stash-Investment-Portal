"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, AlertCircle, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentDetails {
  bankAccountNumber: string;
  bankName: string;
  channel: string;
  expiresIn: string;
  bankAccountName: string;
  amountToPay: number;
  reference: string;
}

interface InstantTopupProps {
  isOpen: boolean;
  paymentDetails: PaymentDetails;
  planId: string;
  onConfirm?: () => void;
  onBack: () => void;
  method?: string;
  isTopUp?: boolean;
}

export default function InstantTopup({
  isOpen,
  paymentDetails,
  planId,
  onConfirm,
  onBack,
  method,
  isTopUp = false,
}: InstantTopupProps) {
  const router = useRouter();
  
  const parseExpiresIn = (expiresIn: string): number => {
    if (expiresIn.includes("h")) {
      const hours = parseInt(expiresIn);
      return hours * 60 * 60 - 5;
    }
    return 59 * 60 + 55;
  };

  const [timeLeft, setTimeLeft] = useState(parseExpiresIn(paymentDetails?.expiresIn || "1h"));

  useEffect(() => {
    if (!isOpen) return;
    
    console.log(`🔼 ${isTopUp ? 'Top-up' : 'Plan creation'} modal opened with:`, {
      planId: planId,
      paymentDetails: paymentDetails,
      expiresIn: paymentDetails?.expiresIn,
      isTopUp: isTopUp
    });
    
    setTimeLeft(parseExpiresIn(paymentDetails?.expiresIn || "1h"));

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isOpen, paymentDetails, planId, isTopUp]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")} : ${s.toString().padStart(2, "0")}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const handleOpenPaystack = () => {
    if (paymentDetails?.bankAccountNumber) {
      window.open(paymentDetails.bankAccountNumber, "_blank");
    }
  };

  const handleConfirmPayment = () => {
    console.log(`🔄 User clicked 'I have paid' for ${isTopUp ? 'top-up' : 'plan creation'}`);
    
    // Call optional onConfirm callback if provided
    if (onConfirm) {
      onConfirm();
    }
    
    console.log(`🚀 Redirecting to PLAN DETAILS: /dashboard/plans/${planId}`);
    
    // Close modal and redirect to PLAN DETAILS PAGE
    onBack();
    router.push(`/dashboard/plans/${planId}`);
  };

  if (!isOpen) return null;

  const displayAmount = paymentDetails?.amountToPay 
    ? `₦${paymentDetails.amountToPay.toLocaleString()}` 
    : "₦0";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm">
      <div className="bg-white w-[450px] rounded-2xl shadow-2xl p-8 relative flex flex-col">
        <button
          onClick={onBack}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mt-2 mb-8">
          <p className="text-sm font-euclid text-gray-600 mb-2">
            Account number expires in
          </p>
          <h2 className="text-4xl font-bold text-gray-900 tracking-wider">
            {formatTime(timeLeft)}
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-euclid text-gray-500 font-medium">Amount</span>
            <div className="flex items-center gap-2">
              <span className="text-[#A243DC] font-bold">{displayAmount}</span>
              <button
                onClick={() => handleCopy(paymentDetails?.amountToPay?.toString() || "")}
                className="text-gray-400 hover:text-[#A243DC] transition-colors"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-euclid font-medium">Bank</span>
            <span className="text-gray-900 font-euclid font-medium">Source MFB</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-euclid font-medium">Bank Name</span>
            <span className="text-gray-900 font-euclid font-medium">myStash Investment</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-euclid text-gray-500 font-medium">
              Account Number
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenPaystack}
                className="text-[#A243DC] font-bold text-lg flex items-center gap-1 hover:underline"
              >
                Pay with Paystack
                <ExternalLink size={16} />
              </button>
              <button
                onClick={() => handleCopy(paymentDetails?.reference || "")}
                className="text-gray-400 hover:text-[#A243DC] transition-colors"
                title="Copy Reference"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          {paymentDetails?.reference && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-euclid text-gray-500 font-medium">
                Payment Reference
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-mono text-sm">
                  {paymentDetails.reference}
                </span>
                <button
                  onClick={() => handleCopy(paymentDetails.reference)}
                  className="text-gray-400 hover:text-[#A243DC] transition-colors"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6 items-start">
            <AlertCircle size={18} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 font-euclid leading-relaxed">
              Transfer only <span className="font-bold">{displayAmount}</span> within
              the given timeframe
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleConfirmPayment}
            className="px-6 py-3 bg-[#A243DC] hover:bg-[#8e3ac0] text-white font-bold text-xs tracking-widest rounded-lg transition-colors font-euclid uppercase shadow-lg shadow-purple-100"
          >
            I have paid
          </button>
        </div>
      </div>
    </div>
  );
}