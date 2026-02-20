"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { changePinService } from "@/app/api/Users";

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChangePinModal({ isOpen, onClose, onSuccess }: ChangePinModalProps) {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"old" | "new" | "confirm">("old");

  if (!isOpen) return null;

  const handleOldPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setOldPin(value);
    setError("");
  };

  const handleNewPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setNewPin(value);
    setError("");
  };

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setConfirmPin(value);
    setError("");
  };

  const handleNextToNew = () => {
    if (oldPin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }
    setStep("new");
  };

  const handleNextToConfirm = () => {
    if (newPin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }
    if (newPin === oldPin) {
      setError("New PIN cannot be same as old PIN");
      return;
    }
    setStep("confirm");
  };

  const handleSubmit = async () => {
    if (confirmPin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    if (newPin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await changePinService({
        oldPin,
        newPin,
      });

      onSuccess();
      // Reset state
      setOldPin("");
      setNewPin("");
      setConfirmPin("");
      setStep("old");
      onClose();
    } catch (err: any) {
      console.error("Failed to change PIN:", err);
      setError(err.response?.data?.message || "Failed to change PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOldPin("");
    setNewPin("");
    setConfirmPin("");
    setStep("old");
    setError("");
    onClose();
  };

  const getTitle = () => {
    switch (step) {
      case "old": return "Enter Current PIN";
      case "new": return "Enter New PIN";
      case "confirm": return "Confirm New PIN";
      default: return "Change PIN";
    }
  };

  const getDescription = () => {
    switch (step) {
      case "old": return "Enter your current 4-digit PIN";
      case "new": return "Enter your new 4-digit PIN";
      case "confirm": return "Confirm your new 4-digit PIN";
      default: return "";
    }
  };

  const getCurrentPin = () => {
    switch (step) {
      case "old": return oldPin;
      case "new": return newPin;
      case "confirm": return confirmPin;
      default: return "";
    }
  };

  const getPinLength = () => {
    switch (step) {
      case "old": return oldPin.length;
      case "new": return newPin.length;
      case "confirm": return confirmPin.length;
      default: return 0;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (step) {
      case "old":
        handleOldPinChange(e);
        break;
      case "new":
        handleNewPinChange(e);
        break;
      case "confirm":
        handleConfirmPinChange(e);
        break;
    }
  };

  const handleNext = () => {
    switch (step) {
      case "old":
        handleNextToNew();
        break;
      case "new":
        handleNextToConfirm();
        break;
      case "confirm":
        handleSubmit();
        break;
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case "old": return oldPin.length !== 4;
      case "new": return newPin.length !== 4;
      case "confirm": return confirmPin.length !== 4;
      default: return true;
    }
  };

  const getButtonText = () => {
    if (loading) return "Processing...";
    switch (step) {
      case "old": return "Next";
      case "new": return "Next";
      case "confirm": return "Change PIN";
      default: return "Next";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100 backdrop-blur-sm">
      <div className="bg-white w-[400px] rounded-2xl shadow-2xl relative p-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-center text-2xl font-euclid font-bold text-gray-900">
          {getTitle()}
        </h2>

        <p className="text-center text-sm text-gray-600 mt-2">
          {getDescription()}
        </p>

        {/* PIN Input */}
        <div className="mt-8 flex flex-col items-center">
          <input
            type="password"
            value={getCurrentPin()}
            onChange={handleChange}
            className="w-32 text-center text-3xl font-bold tracking-widest border-b-2 border-gray-300 focus:border-primary focus:outline-none pb-2"
            maxLength={4}
            inputMode="numeric"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            {getPinLength()}/4 digits
          </p>
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
          
          <button
            onClick={handleNext}
            disabled={isNextDisabled() || loading}
            className={`w-1/2 py-3 font-manrope rounded-xl transition-colors ${
              isNextDisabled() || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#A243DC] text-white hover:bg-[#8e3ac0]"
            }`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}