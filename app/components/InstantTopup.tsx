"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, AlertCircle } from "lucide-react";

export default function InstantTopup({
  isOpen,
  amount,
  onConfirm, // This will trigger when they click "I HAVE PAID"
  onBack, // This will trigger when they click the "X" to close
}: {
  isOpen: boolean;
  amount: string;
  onConfirm: () => void;
  onBack: () => void;
  method?: string; // Kept optional so your parent component doesn't break
}) {
  // --- 1. TIMER LOGIC (59 mins 55 secs) ---
  const [timeLeft, setTimeLeft] = useState(59 * 60 + 55);

  useEffect(() => {
    if (!isOpen) return; // Don't run timer if modal is closed

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isOpen]);

  // Helper to make time look like "59 : 55"
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")} : ${s
      .toString()
      .padStart(2, "0")}`;
  };

  // --- 2. COPY TO CLIPBOARD LOGIC ---
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!"); // Replace with a toast notification if you have one
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm">
      <div className="bg-white w-[450px] rounded-2xl shadow-2xl p-8 relative flex flex-col">
        {/* Close Button (Triggers onBack) */}
        <button
          onClick={onBack}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header: Timer */}
        <div className="text-center mt-2 mb-8">
          <p className="text-sm font-euclid text-gray-600 mb-2">
            Account number expires in
          </p>
          <h2 className="text-4xl font-bold text-gray-900 tracking-wider">
            {formatTime(timeLeft)}
          </h2>
        </div>

        {/* Details List */}
        <div className="space-y-6">
          {/* Amount */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-euclid text-gray-500 font-medium">Amount</span>
            <div className="flex items-center gap-2">
              <span className="text-[#A243DC] font-bold">₦{amount}</span>
              <button
                onClick={() => handleCopy(amount)}
                className="text-gray-400 hover:text-[#A243DC] transition-colors"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          {/* Bank */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-euclid font-medium">Bank</span>
            <span className="text-gray-900 font-euclid font-medium">Source MFB</span>
          </div>

          {/* Bank Name */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 font-euclid font-medium">Bank Name</span>
            <span className="text-gray-900 font-euclid font-medium">
              myStash Investment
            </span>
          </div>

          {/* Account Number */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-euclid text-gray-500 font-medium">
              Account Number
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#A243DC] font-bold text-lg">
                5065244473
              </span>
              <button
                onClick={() => handleCopy("5065244473")}
                className="text-gray-400 hover:text-[#A243DC] transition-colors"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          {/* Warning Info */}
          <div className="flex gap-3 mt-6 items-start">
            <AlertCircle size={18} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 font-euclid leading-relaxed">
              Transfer only <span className="font-bold">₦{amount}</span> within
              the given timeframe
            </p>
          </div>
        </div>

        {/* Footer Button (Triggers onConfirm) */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-[#A243DC] hover:bg-[#8e3ac0] text-white font-bold text-xs tracking-widest rounded-lg transition-colors font-euclid uppercase shadow-lg shadow-purple-100"
          >
            I have paid
          </button>
        </div>
      </div>
    </div>
  );
}
