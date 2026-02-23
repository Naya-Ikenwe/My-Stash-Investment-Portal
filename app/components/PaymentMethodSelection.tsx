"use client";

import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
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

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Close button clicked"); // Debug log
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close when clicking the overlay background
    if (e.target === e.currentTarget) {
      console.log("Overlay clicked"); // Debug log
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-[650px] rounded-4xl shadow-2xl p-20 relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer z-10"
          type="button"
        >
          <X size={26} />
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-900">
            Select funding source
          </h2>
        </div>

        {/* Options */}
        <div className="flex flex-col space-y-6">
          
          {/* Instant Transfer */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Instant Transfer selected"); // Debug log
              onSelectInstant();
            }}
            className="flex items-center justify-between border border-gray-200 rounded-2xl px-6 py-6 cursor-pointer hover:border-[#A243DC] hover:bg-purple-50 transition-all"
          >
            <div className="flex items-center space-x-4">
              <Image
                src="/instant.svg"
                alt="Instant Transfer"
                width={28}
                height={28}
              />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Instant Transfer
                </p>
                <p className="text-sm text-gray-500">
                  Processed immediately
                </p>
              </div>
            </div>

            {/* Radio Circle */}
            <div className="w-6 h-6 rounded-full border-2 border-[#A243DC] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#A243DC]" />
            </div>
          </div>

          {/* Bank Transfer */}
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Bank Transfer selected"); // Debug log
              onSelectBank();
            }}
            className="flex items-center justify-between border border-gray-200 rounded-2xl px-6 py-6 cursor-pointer hover:border-[#A243DC] hover:bg-purple-50 transition-all"
          >
            <div className="flex items-center space-x-4">
              <Image
                src="/purplehouse.svg"
                alt="Bank Transfer"
                width={28}
                height={28}
              />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Bank Transfer
                </p>
                <p className="text-sm text-gray-500">
                  May take some time to process
                </p>
              </div>
            </div>

            {/* Radio Circle */}
            <div className="w-6 h-6 rounded-full border-2 border-[#A243DC]" />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 bg-yellow-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600 leading-relaxed">
          <p>
            Instant transfers include a service fee of{" "}
            <span className="font-semibold text-gray-900">
              {formatCurrency(instantTransfer.fee)}
            </span>.
          </p>
          <p className="mt-1">
            Instant payments are processed immediately, while bank transfers
            may take some time to reflect.
          </p>
        </div>
      </div>
    </div>
  );
}