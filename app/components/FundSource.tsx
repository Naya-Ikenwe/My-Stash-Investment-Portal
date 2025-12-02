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
};

export default function FundSource({ onClose, amount = "0" }: FundSourceProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    "instant" | "bank" | null
  >(null);

  const sources = [
    { icon: <BiTransferAlt />, name: "Instant Transfer", id: "instant" },
    { icon: <BiSolidBank />, name: "Bank Transfer", id: "bank" },
  ];

  const handleMethodSelect = (id: "instant" | "bank") => {
    setSelectedMethod(id);
  };

  const handleBack = () => {
    setSelectedMethod(null);
  };

  // This is where the option shows based on selection
  const handleConfirm = () => {
    setSelectedMethod(null);
    onClose();
  };

  if (selectedMethod === "instant") {
    return (
      <InstantTopup
        isOpen={true}
        amount={amount}
        onConfirm={handleConfirm}
        onBack={handleBack}
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
