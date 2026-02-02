"use client";

import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import HoverWrapper from "./HoverWrapper";
import { BiSolidBank, BiTransferAlt } from "react-icons/bi";
import InstantTopup from "./InstantTopup";
import BankTopup from "./BankTopup";

type FundSourceProps = {
  onClose: () => void;
  amount?: string;
  planId?: string; // Add planId prop
  // Optional: Add callback to fetch payment details
  onGetPaymentDetails?: () => Promise<any>;
};

export default function FundSource({ 
  onClose, 
  amount = "0", 
  planId = "", // Default empty string
  onGetPaymentDetails 
}: FundSourceProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    "instant" | "bank" | null
  >(null);
  
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const sources = [
    { icon: <BiTransferAlt />, name: "Instant Transfer", id: "instant" },
    { icon: <BiSolidBank />, name: "Bank Transfer", id: "bank" },
  ];

  const handleMethodSelect = async (id: "instant" | "bank") => {
    if (id === "instant") {
      // For InstantTopup, we need paymentDetails
      if (onGetPaymentDetails) {
        try {
          // Fetch payment details from parent
          const details = await onGetPaymentDetails();
          setPaymentDetails(details);
          setSelectedMethod(id);
        } catch (error) {
          console.error("Failed to get payment details:", error);
          alert("Could not get payment details. Please try again.");
        }
      } else {
        // Use mock data if no callback provided
        setPaymentDetails({
          amountToPay: Number(amount) || 0,
          bankAccountNumber: "0123456789",
          bankName: "Source MFB",
          channel: "bank_transfer",
          expiresIn: "1h",
          bankAccountName: "myStash Investment",
          reference: `REF-${Date.now()}`,
        });
        setSelectedMethod(id);
      }
    } else {
      setSelectedMethod(id);
    }
  };

  const handleBack = () => {
    setSelectedMethod(null);
    setPaymentDetails(null);
  };

  const handleConfirm = () => {
    setSelectedMethod(null);
    setPaymentDetails(null);
    onClose();
  };

  if (selectedMethod === "instant" && paymentDetails) {
    return (
      <InstantTopup
        isOpen={true}
        paymentDetails={paymentDetails} // ✅ Correct prop
        planId={planId} // ✅ Required prop
        onConfirm={handleConfirm}
        onBack={handleBack}
        isTopUp={true}
      />
    );
  }

  if (selectedMethod === "bank") {
    return (
      <BankTopup
        isOpen={true}
        amount={amount}
        onConfirm={handleConfirm}
        onBack={handleBack}
      />
    );
  }

  return (
    <HoverWrapper className="py-14">
      <IoMdClose
        className="absolute top-4 right-4 cursor-pointer"
        onClick={onClose}
        size={20}
      />

      <div className="w-[70%] flex flex-col gap-10 items-center">
        <h2>Select Funding Source</h2>

        <div className="flex flex-col gap-4 w-full">
          {sources.map((source) => (
            <button
              key={source.name}
              onClick={() =>
                handleMethodSelect(source.id as "instant" | "bank")
              }
              className="flex items-center gap-3 px-3 py-3 bg-white w-full rounded-lg border border-[#2323231A] hover:border-[#A243DC] hover:bg-purple-50 transition-all cursor-pointer"
            >
              <span className="text-primary text-xl">{source.icon}</span>
              <p className="text-[16px]">{source.name}</p>
            </button>
          ))}
        </div>
      </div>
    </HoverWrapper>
  );
}