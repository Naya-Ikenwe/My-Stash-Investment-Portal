"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import Image from "next/image";
import SummaryLiquidate from "./SummaryLiquidate";
import { getUserBankAccountsService } from "@/app/api/Users";
import API from "@/lib/axiosInstance";

// Bank account type from API
interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  createdAt: string;
}

export default function ContinueLiquidate({
  isOpen,
  onClose,
  onConfirm,
  planId,
  planBalance,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planId: string;
  planBalance: number;
}) {
  // State to manage the amount input
  const [amount, setAmount] = useState<string>(planBalance.toLocaleString());
  const [showSummary, setShowSummary] = useState(false);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isFullLiquidation, setIsFullLiquidation] = useState(true);

  // Fetch user's bank account on mount
  useEffect(() => {
    const fetchBankAccount = async () => {
      try {
        setLoading(true);
        const response = await getUserBankAccountsService();
        if (response.data) {
          setBankAccount(response.data);
        }
      } catch (err: any) {
        console.error('Failed to fetch bank account:', err);
        setError("Failed to load bank account. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchBankAccount();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Format amount for display
  const formatAmount = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Format with commas
    return digits ? parseInt(digits).toLocaleString() : '';
  };

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatAmount(value);
    setAmount(formatted);
    setIsFullLiquidation(false);
    
    // If user cleared the field or entered 0, treat as full liquidation
    const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
    if (numericValue === 0 || numericValue >= planBalance) {
      setIsFullLiquidation(true);
      setAmount(planBalance.toLocaleString());
    }
  };

  // Handle liquidate all button
  const handleLiquidateAll = () => {
    setAmount(planBalance.toLocaleString());
    setIsFullLiquidation(true);
  };

  // Get numeric amount
  const getNumericAmount = () => {
    return parseInt(amount.replace(/\D/g, '')) || 0;
  };

  // Validate before proceeding
  const handleContinue = () => {
    const numericAmount = getNumericAmount();
    
    if (!bankAccount) {
      setError("No bank account found. Please add a bank account first.");
      return;
    }

    if (numericAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (numericAmount > planBalance) {
      setError("Amount cannot exceed plan balance");
      return;
    }

    setError("");
    setShowSummary(true);
  };

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
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-between w-full mb-3">
              <label className="text-sm font-euclid text-gray-500">
                Amount (₦{planBalance.toLocaleString()} available)
              </label>
              <button
                onClick={handleLiquidateAll}
                className="text-primary text-sm font-medium hover:underline"
              >
                Liquidate All
              </button>
            </div>

            {/* NGN Currency Selector */}
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
              <span className="text-sm font-semibold font-manrope text-gray-700">NGN</span>
            </button>

            {/* Amount Input Field */}
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full text-center text-4xl font-bold text-gray-900 focus:outline-none placeholder-gray-300 border-b-2 border-gray-200 focus:border-primary pb-2"
              placeholder="0"
              inputMode="numeric"
            />
            
            {isFullLiquidation && (
              <p className="text-xs text-green-600 mt-2">
                Full liquidation selected
              </p>
            )}
          </div>

          {/* Bank Account Display */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 font-euclid mb-3">Withdraw to</p>
            
            {loading ? (
              <div className="border border-gray-200 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Loading bank account...</p>
              </div>
            ) : bankAccount ? (
              <div className="border border-gray-200 p-4 rounded-xl flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                  <Image
                    src="/bank-icon.svg"
                    alt="Bank"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {bankAccount.accountName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {bankAccount.accountNumber} • {bankAccount.bankCode === "057" ? "Zenith Bank" : 
                     bankAccount.bankCode === "044" ? "Access Bank" : 
                     `Bank Code: ${bankAccount.bankCode}`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500">No bank account found</p>
                <button className="text-primary text-sm mt-1 hover:underline">
                  Add bank account
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Disclaimer Message */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Important:</span> Liquidating funds before maturity date will attract a breaking fee of 1% of the amount you want to liquidate.
            </p>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!bankAccount || getNumericAmount() <= 0 || loading}
              className={`w-full px-8 py-3 text-white font-medium rounded-xl transition-colors font-manrope shadow-md ${
                !bankAccount || getNumericAmount() <= 0 || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#A243DC] hover:bg-[#8e3ac0] shadow-purple-200"
              }`}
            >
              {loading ? "Loading..." : "Continue"}
            </button>
          </div>
        </div>

        {/* Summary Modal */}
        <SummaryLiquidate
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
          amount={amount}
          selectedAccount={bankAccount}
          planId={planId}
          isFullLiquidation={isFullLiquidation}
          onLiquidationSuccess={onConfirm}
        />
      </div>
    </div>
  );
}