"use client";

import React from "react";
import { X } from "lucide-react";
import { InstantTransferDetails, BankTransferDetails } from "../api/Plan";

interface PaymentMethodSelectionProps {
  isOpen: boolean;
  instantTransfer: InstantTransferDetails;
  bankTransfer: BankTransferDetails;
  onSelectInstant: () => void;
  onSelectBank: () => void;
  onClose: () => void;
}

export default function PaymentMethodSelection({
  isOpen,
  instantTransfer,
  bankTransfer,
  onSelectInstant,
  onSelectBank,
  onClose,
}: PaymentMethodSelectionProps) {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString()}`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-[600px] rounded-2xl shadow-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Choose Payment Method</h2>
          <p className="text-gray-600 mt-2">Select how you want to fund your plan</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Instant Transfer Option */}
          <div
            onClick={onSelectInstant}
            className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#A243DC] hover:bg-purple-50 transition-all"
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Instant Transfer
              </h3>
              <p className="text-sm text-gray-600">
                Pay via Paystack checkout
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(instantTransfer.amount)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service Fee:</span>
                <span className="font-semibold text-orange-600">
                  {formatCurrency(instantTransfer.fee)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-lg text-[#A243DC]">
                  {formatCurrency(instantTransfer.amount + instantTransfer.fee)}
                </span>
              </div>
            </div>

            <button className="w-full mt-6 bg-[#A243DC] text-white py-2 rounded-lg font-semibold hover:bg-[#8e3ac0] transition-colors">
              Continue
            </button>
          </div>

          {/* Bank Transfer Option */}
          <div
            onClick={onSelectBank}
            className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#44C56F] hover:bg-green-50 transition-all"
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Bank Transfer
              </h3>
              <p className="text-sm text-gray-600">
                Direct bank account transfer
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(bankTransfer.amount)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service Fee:</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-lg text-[#44C56F]">
                  {formatCurrency(bankTransfer.amount)}
                </span>
              </div>
            </div>

            <button className="w-full mt-6 bg-[#44C56F] text-white py-2 rounded-lg font-semibold hover:bg-[#38a055] transition-colors">
              Continue
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          You can change your payment method after this step if needed
        </p>
      </div>
    </div>
  );
}
