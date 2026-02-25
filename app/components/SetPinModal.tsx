"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { setUserPinService } from "@/app/api/Users";

interface SetPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
}

export default function SetPinModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Set Transaction PIN" 
}: SetPinModalProps) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"pin" | "confirm">("pin");

  if (!isOpen) return null;

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(value);
    setError("");
  };

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setConfirmPin(value);
    setError("");
  };

  const handleNext = () => {
    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }
    setStep("confirm");
  };

  const handleSubmit = async () => {
    if (confirmPin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await setUserPinService({ pin });
      onSuccess();
      // Reset state
      setPin("");
      setConfirmPin("");
      setStep("pin");
      onClose();
    } catch (err: any) {
      console.error("Failed to set PIN:", err);
      setError(err.response?.data?.message || "Failed to set PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPin("");
    setConfirmPin("");
    setStep("pin");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 backdrop-blur-sm p-4">
      <div className="bg-white w-full lg:w-[400px] rounded-2xl shadow-2xl relative p-6 lg:p-8 max-h-screen lg:max-h-auto overflow-y-auto lg:overflow-y-visible">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-center text-2xl font-euclid font-bold text-gray-900">
          {title}
        </h2>

        <p className="text-center text-sm text-gray-600 mt-2">
          {step === "pin" 
            ? "Enter a 4-digit PIN for transaction authorization" 
            : "Confirm your 4-digit PIN"}
        </p>

        {/* PIN Input */}
        <div className="mt-8 flex flex-col items-center">
          {step === "pin" ? (
            <>
              <input
                type="password"
                value={pin}
                onChange={handlePinChange}
                className="w-32 text-center text-3xl font-bold tracking-widest border-b-2 border-gray-300 focus:border-primary focus:outline-none pb-2"
                maxLength={4}
                inputMode="numeric"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                {pin.length}/4 digits
              </p>
            </>
          ) : (
            <>
              <input
                type="password"
                value={confirmPin}
                onChange={handleConfirmPinChange}
                className="w-32 text-center text-3xl font-bold tracking-widest border-b-2 border-gray-300 focus:border-primary focus:outline-none pb-2"
                maxLength={4}
                inputMode="numeric"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                {confirmPin.length}/4 digits
              </p>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={handleClose}
            className="w-1/2 border border-gray-300 text-gray-700 py-3 font-manrope rounded-xl hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          
          {step === "pin" ? (
            <button
              onClick={handleNext}
              disabled={pin.length !== 4 || loading}
              className={`w-1/2 py-3 font-manrope rounded-xl transition-colors ${
                pin.length !== 4 || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#A243DC] text-white hover:bg-[#8e3ac0]"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={confirmPin.length !== 4 || loading}
              className={`w-1/2 py-3 font-manrope rounded-xl transition-colors ${
                confirmPin.length !== 4 || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#A243DC] text-white hover:bg-[#8e3ac0]"
              }`}
            >
              {loading ? "Setting..." : "Set PIN"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}