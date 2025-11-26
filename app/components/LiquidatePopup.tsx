"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import ContinueLiquidate from "./ContinueLiquidate";

export default function LiquidatePopup({
  isOpen,
  onClose,
  planStatus,
}: {
  isOpen: boolean;
  onClose: () => void;
  planStatus: string;
}) {
  const [showContinueLiquidate, setShowContinueLiquidate] = useState(false);
  if (!isOpen) return null;

  const isNotMatured = planStatus !== "Matured";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm">
      <div className="bg-white w-[400px] rounded-2xl shadow-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {isNotMatured ? (
          <>
            <h3 className="text-[32px] font-bold text-center text-[#303437] mb-4">
              Liquidate Funds?
            </h3>
            <p className="text-[16px] text-center text-[#6C7072] mb-6">
              Liquidating funds before maturity date will attract a breaking fee
              of 1% of the amount you want to liquidate.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowContinueLiquidate(true)}
                className="flex-1 px-4 py-2 bg-[#A243DC] hover:bg-[#8e3ac0] text-white rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirm Liquidation
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to liquidate this plan? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowContinueLiquidate(true)}
                className="flex-1 px-4 py-2 bg-[#A243DC] hover:bg-[#8e3ac0] text-white rounded-lg transition-colors"
              >
                Liquidate
              </button>
            </div>
          </>
        )}
        <ContinueLiquidate
          isOpen={showContinueLiquidate}
          onClose={() => setShowContinueLiquidate(false)}
          onConfirm={() => {
            // Handle liquidation confirmation
            console.log("Liquidation confirmed");
            setShowContinueLiquidate(false);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
