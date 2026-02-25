"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, AlertCircle, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { InstantTransferDetails } from "../api/Plan";

interface InstantTopupProps {
  isOpen: boolean;
  instantTransfer: InstantTransferDetails;
  planId: string;
  onConfirm?: () => void;
  onBack: () => void;
  isTopUp?: boolean;
}

export default function InstantTopup({
  isOpen,
  instantTransfer,
  planId,
  onConfirm,
  onBack,
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

  const [timeLeft, setTimeLeft] = useState(parseExpiresIn(instantTransfer?.expiresIn || "1h"));
  const [useIframe, setUseIframe] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    
    setTimeLeft(parseExpiresIn(instantTransfer?.expiresIn || "1h"));

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isOpen, instantTransfer, planId, isTopUp]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")} : ${s.toString().padStart(2, "0")}`;
  };

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

    
    if (onConfirm) {
      onConfirm();
    }
    

    
    onBack();
    router.push(`/dashboard/plans/${planId}`);
  };

  if (!isOpen) return null;

  // Principal/Net amount (what user is investing)
  const displayPrincipal = instantTransfer?.net 
    ? `₦${instantTransfer.net.toLocaleString()}` 
    : "₦0";

  // Service fee
  const displayFee = instantTransfer?.fee
    ? `₦${instantTransfer.fee.toLocaleString()}`
    : "₦0";

  // Total amount to pay
  const totalAmount = instantTransfer?.amount 
    ? `₦${instantTransfer.amount.toLocaleString()}` 
    : "₦0";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-2xl relative flex flex-col ${
        useIframe && instantTransfer?.checkoutUrl
          ? "w-[85vw] h-[95vh]"
          : "w-[600px] max-h-[90vh]"
      }`}>
        <button
          onClick={onBack}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-2"
        >
          <X size={24} />
        </button>

        {/* Show iframe if Paystack checkout URL is available */}
        {useIframe && instantTransfer?.checkoutUrl ? (
          <>
            <div className="text-center py-4 px-8 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700">
                Complete Payment via Paystack
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Account expires in {formatTime(timeLeft)}
              </p>
            </div>

            <div className="flex-1 overflow-auto">
              <iframe
                src={instantTransfer.checkoutUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="auto"
                onError={() => setUseIframe(false)}
              />
            </div>

            <div className="border-t border-gray-200 bg-white p-8 flex gap-3 items-start">
              <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Complete the payment in the Paystack form above, then click "Payment Confirmed"
              </p>
            </div>

            <div className="px-8 pb-8 flex justify-end gap-3">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-6 py-2 bg-[#A243DC] hover:bg-[#8e3ac0] text-white font-bold text-sm rounded-lg transition-colors"
              >
                Payment Confirmed
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Fallback: Show payment details with amount breakdown */}
            <div className="p-8 overflow-y-auto flex flex-col gap-6">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Account number expires in
                </p>
                <h2 className="text-4xl font-bold text-gray-900 tracking-wider">
                  {formatTime(timeLeft)}
                </h2>
              </div>

              {/* Amount Breakdown */}
              <div className="space-y-3 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-[#A243DC] font-bold text-2xl">{totalAmount}</span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  This amount includes a service fee of {displayFee}
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* Payment Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">Bank</span>
                  <span className="text-gray-900 font-semibold">{instantTransfer?.bankName || "Source MFB"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">Account Name</span>
                  <span className="text-gray-900 font-semibold">{instantTransfer?.bankAccountName || "myStash Investment"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">Channel</span>
                  <span className="text-gray-900 font-semibold">{instantTransfer?.channel || "PAYSTACK"}</span>
                </div>

                {instantTransfer?.reference && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">Reference</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-mono text-xs">
                        {instantTransfer.reference}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopy(instantTransfer.reference);
                        }}
                        className="text-gray-400 hover:text-[#A243DC] transition-colors cursor-pointer"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 items-start bg-blue-50 p-4 rounded-lg">
                <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  Transfer the total amount shown above within the given timeframe.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 p-8 flex justify-end">
              <button
                onClick={handleConfirmPayment}
                className="px-8 py-3 bg-[#A243DC] hover:bg-[#8e3ac0] text-white font-bold text-sm tracking-widest rounded-lg transition-colors uppercase shadow-lg shadow-purple-100"
              >
                I have paid
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}