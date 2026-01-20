"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Password from "./Password";

export default function SummaryLiquidate({
  isOpen,
  onClose,
  amount,
  selectedAccount,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  selectedAccount: {
    id: number;
    name: string;
    bank: string;
    accountNumber: string;
    image: string;
  } | null;
}) {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !selectedAccount) return null;

  const breakingFee = parseFloat(amount.replace(/,/g, "")) * 0.01;
  const netAmount = parseFloat(amount.replace(/,/g, "")) - breakingFee;

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
        </div>

        {/* Destination Account */}
        <div className="mt-10">
          <p className="text-sm text-center font-euclid text-gray-500 mb-4">
            Destination Account
          </p>

          <div className="flex items-center bg-[#F2F4F5] justify-center gap-3 border border-gray-200 rounded-xl p-4">
            <Image
              src={selectedAccount.image}
              alt={selectedAccount.bank}
              width={30}
              height={30}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {selectedAccount.name}
              </p>
              <p className="text-sm text-gray-600">
                {selectedAccount.bank} · {selectedAccount.accountNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex justify-between items-center gap-2 mt-6">
          <p className="text-sm font-euclid text-gray-700">
            Agree to early liquidation terms <br />& conditions
          </p>
          <input type="checkbox" className="w-4 h-4" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={onClose}
            className="w-1/2 border border-[#A243DC] text-[#A243DC] py-3 font-manrope rounded-xl"
          >
            Back
          </button>
          <button
            onClick={() => setShowPassword(true)}
            className="w-1/2 bg-[#A243DC] text-white py-3 font-manrope rounded-xl hover:bg-[#8e3ac0] transition-colors"
          >
            Confirm
          </button>
        </div>

        {/* Password Modal */}
        <Password
          isOpen={showPassword}
          onClose={() => setShowPassword(false)}
          onConfirm={() => {
            // Handle password confirmation
            console.log("Liquidation confirmed with password");
            setShowPassword(false);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
