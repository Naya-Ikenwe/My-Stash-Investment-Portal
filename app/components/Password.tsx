"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { authorizeIntentService } from "@/app/api/Users";
import SetPinModal from "./SetPinModal"; // Import the new modal

export default function Password({
  isOpen,
  onClose,
  intentId,
  onAuthorizationSuccess,
  hasPin = true, // Add this prop to check if user has PIN
}: {
  isOpen: boolean;
  onClose: () => void;
  intentId: string;
  onAuthorizationSuccess: () => void;
  hasPin?: boolean; // Pass this from parent component
}) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSetPinModal, setShowSetPinModal] = useState(false);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(value);
    setError("");
  };

  const handleSubmit = async () => {
    // Check if user has PIN first
    if (!hasPin) {
      setShowSetPinModal(true);
      return;
    }

    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authorizeIntentService(intentId, {
        method: "PIN",
        pin: pin,
      });

      // Authorization successful
      onAuthorizationSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinSetSuccess = () => {
    setShowSetPinModal(false);
    // Now that PIN is set, retry authorization
    // We need to get the new hasPin status from parent
    // For now, we'll just close and let user try again
    onClose();
    // You might want to show a success message here
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-70 backdrop-blur-sm">
        <div className="bg-white w-[400px] rounded-2xl shadow-2xl relative p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <h2 className="text-center text-2xl font-euclid font-bold text-gray-900">
            Enter PIN
          </h2>

          <p className="text-center text-sm text-gray-600 mt-2">
            {hasPin 
              ? "Enter your 4-digit PIN to authorize the liquidation"
              : "You need to set a transaction PIN first"}
          </p>

          {/* PIN Input - Only show if user has PIN */}
          {hasPin && (
            <div className="mt-8 flex justify-center">
              <input
                type="password"
                value={pin}
                onChange={handlePinChange}
                className="w-32 text-center text-3xl font-bold tracking-widest border-b-2 border-gray-300 focus:border-primary focus:outline-none pb-2"
                maxLength={4}
                inputMode="numeric"
                autoFocus
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={onClose}
              className="w-1/2 border border-gray-300 text-gray-700 py-3 font-manrope rounded-xl hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || (hasPin && pin.length !== 4)}
              className={`w-1/2 py-3 font-manrope rounded-xl transition-colors ${
                loading || (hasPin && pin.length !== 4)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#A243DC] text-white hover:bg-[#8e3ac0]"
              }`}
            >
              {loading ? "Authorizing..." : hasPin ? "Authorize" : "Set PIN Now"}
            </button>
          </div>

          {/* Message for users without PIN */}
          {!hasPin && (
            <p className="text-xs text-center text-gray-500 mt-4">
              Click "Set PIN Now" to create your transaction PIN
            </p>
          )}
        </div>
      </div>

      {/* Set PIN Modal */}
      <SetPinModal
        isOpen={showSetPinModal}
        onClose={() => setShowSetPinModal(false)}
        onSuccess={handlePinSetSuccess}
        title="Set Transaction PIN"
      />
    </>
  );
}