"use client";

import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import Image from "next/image";
import SummaryLiquidate from "./SummaryLiquidate";

export default function ContinueLiquidate({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  // State to manage the amount input
  const [amount, setAmount] = useState("120,000");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<{
    id: number;
    name: string;
    bank: string;
    accountNumber: string;
    image: string;
  } | null>(null);

  // Mock bank account data
  const bankAccounts = [
    {
      id: 1,
      name: "Osatuyi Olatipe",
      bank: "Access Bank",
      accountNumber: "1234567890",
      image: "/access.svg",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm">
      <div className="bg-white w-[450px] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={20} />
        </button>

        {/* Header Section */}
        <div className="pt-8 pb-4 text-center">
          <h2 className="text-xl font-bold font-euclid text-gray-900">
            Liquidate from Rent Plan
          </h2>
          <p className="text-xs font-medium font-euclid text-gray-500 uppercase mt-1">
            Savings • NGN
          </p>
        </div>

        <div className="px-8 pb-8">
          {/* Amount Input Section */}
          <div className="flex flex-col items-center mb-10">
            <label className="text-sm font-euclid text-gray-500 mb-3">Amount</label>

            {/* NGN Currency Selector */}
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-full mb-2">
              <div className="flex items-center justify-center overflow-hidden rounded-full border border-black/10">
                {/* Ensure /flag.svg is in your public directory */}
                <Image
                  src="/flag.svg"
                  alt="NGN"
                  width={20}
                  height={20}
                  className="object-cover w-5 h-5"
                />
              </div>
              <span className="text-sm font-semibold font-manrope text-gray-700">NGN</span>
            </button>

            {/* Actual Amount Input Field */}
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-center text-4xl font-bold text-gray-900 focus:outline-none placeholder-gray-300"
              placeholder="0"
            />
            <hr className="border border-[#455A6433] w-full mt-5" />
          </div>

          {/* Withdraw To Section */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 font-euclid mb-3">Withdraw to</p>

            {/* Custom Dropdown/Selector */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`border border-gray-200 p-4 flex justify-between items-center cursor-pointer rounded-xl hover:border-gray-300 transition-all ${
                isDropdownOpen ? "rounded-b-none border-b-0" : ""
              }`}
            >
              <span className="text-sm font-medium text-gray-700">
                {selectedAccount ? selectedAccount.name : "Bank Account"}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="border border-gray-200 border-t-0 rounded-b-xl p-3 space-y-2 bg-white">
                {bankAccounts.map((account) => (
                  <div
                    key={account.id}
                    onClick={() => {
                      setSelectedAccount(account);
                      setIsDropdownOpen(false);
                    }}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    {/* Account Name at top */}
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src={account.image}
                        alt={account.bank}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {account.name}
                        </h4>
                        <p className="text-[10px] text-gray-600">
                          {account.bank} · {account.accountNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowSummary(true)}
              className="w-full px-8 py-3 bg-[#A243DC] hover:bg-[#8e3ac0] text-white font-medium rounded-xl transition-colors font-manrope shadow-md shadow-purple-200"
            >
              Continue
            </button>
          </div>
        </div>

        {/* Summary Modal */}
        <SummaryLiquidate
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
          amount={amount}
          selectedAccount={selectedAccount}
        />
      </div>
    </div>
  );
}
