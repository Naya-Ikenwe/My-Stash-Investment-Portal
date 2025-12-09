"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export default function Password({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleContinue = () => {
    if (password.trim()) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 backdrop-blur-sm">
      <div className="bg-white w-[400px] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={20} />
        </button>

        {/* Header Section */}
        <div className="pt-8 pb-4 text-center">
          <h2 className="text-xl font-bold font-euclid text-gray-900 mb-20">
            Password Required
          </h2>
        </div>

        <div className="px-8 pb-8">
          {/* Password Input Section */}
          <div className="mb-8">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              className="w-full px-4 py-3 border border-gray-300 mb-15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A243DC] focus:border-transparent placeholder:font-euclid"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleContinue();
                }
              }}
            />
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!password.trim()}
              className="w-full px-8 py-3 bg-[#A243DC] hover:bg-[#8e3ac0] text-white font-medium rounded-xl transition-colors shadow-md font-manrope shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
