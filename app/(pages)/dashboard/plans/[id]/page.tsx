"use client";

import React, { useState } from "react";
import { savings } from "@/data/PlansData";
import Image from "next/image";
import Link from "next/link";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import TopUpModal from "@/app/components/TopupModal";
import LiquidatePopup from "@/app/components/LiquidatePopup";

export default function PlanDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = React.use(params);
  const { id } = resolved;
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showLiquidatePopup, setShowLiquidatePopup] = useState(false);

  console.log("PARAM ID:", id);
  console.log("SAVINGS:", savings);

  const plan = savings.find((p) => p.id == Number(id));
  if (!plan) return <p>Plan not found</p>;
  console.log("PLAN FOUND:", plan);

  return (
    <main className="p-6 gap-6">
      <Link
        href="/dashboard/plans"
        className="flex items-center w-[90px] h-[42px] gap-1 text-sm text-[#37474F] mb-4"
      >
        <MdOutlineKeyboardArrowLeft />
        <p>Back</p>
      </Link>
      {/* LEFT CARD */}
      <div className="flex gap-20">
        <div className="bg-[#F7F7F7] w-[557px] h-[265px] p-6 rounded-xl shadow-sm">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            {plan.title}
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                plan.status === "Active"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {plan.status}
            </span>
          </h1>

          <p className="text-4xl font-bold mt-4">
            ₦{plan.amount.toLocaleString()}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setShowTopUpModal(true)}
              className="bg-[#A243DC] flex gap-2 items-center text-white px-6 py-2 rounded-lg cursor-pointer"
            >
              <FiArrowDownLeft size={20} />
              <p>{plan.status === "Matured" ? "Rollover" : "Top-up"}</p>
            </button>

            <Link
              href={"#"}
              onClick={(e) => {
                e.preventDefault();
                setShowLiquidatePopup(true);
              }}
              className="border flex items-center gap-2 text-center border-[#A243DC] text-[#A243DC] px-6 py-2 rounded-lg cursor-pointer"
            >
              <FiArrowUpRight size={20} />
              <p>Liquidate</p>
            </Link>
          </div>

          {/* Toggle */}
          <div className="flex justify-between mt-6 items-center">
            <span className="text-gray-700">Reinvest after maturity</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A243DC] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A243DC]"></div>
            </label>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-[#F7F7F7] w-[350px] p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-[#0053A6] mb-4">
            Performance Summary
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Plan Created on</span>
              <span className="font-medium">25th July 2025</span>
            </div>

            <div className="flex justify-between">
              <span>Plan Maturity Date</span>
              <span className="font-medium">28th July 2026</span>
            </div>

            <div className="flex justify-between">
              <span>Amount Invested</span>
              <span className="font-medium">
                ₦{plan.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Returns & Earnings</span>
              <span className="font-medium">----</span>
            </div>

            {/* Only show for matured plans */}
            {plan.status === "Matured" &&
              plan.accountHolderName &&
              plan.accountNumber && (
                <div className="bg-white space-y-1 border-2 p-4 rounded-2xl mt-4">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src="/access.svg"
                      alt="Access Bank"
                      className="w-12 h-12"
                    />

                    <span className="z-10 font-semibold text-gray-800">
                      Access Bank
                    </span>
                  </div>

                  <div className="font-normal text-[16px] tracking-wide">
                    <span className="font-medium">
                      {plan.accountHolderName}
                    </span>
                  </div>
                  <div className="font-normal text-[16px] tracking-wide">
                    <span className="font-medium">{plan.accountNumber}</span>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div
        className={`bg-[#F7F7F7] p-6 rounded-xl shadow-sm w-[557px] ${
          plan.status === "Active" ? "mt-6" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-[#303437]">Transaction History</h3>
          <Link
            href="#"
            className="text-sm flex items-center gap-2 text-[#303437] hover:underline"
          >
            <p>View all</p>
            <IoIosArrowForward />
          </Link>
        </div>

        {/* Map transactions */}
        <div className="space-y-4">
          {plan.transactions?.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* ICON */}
                <Image
                  src={
                    tx.type === "deposit"
                      ? "/manual.svg"
                      : tx.type === "interest"
                      ? "/interest.svg"
                      : "/withdrawal.svg"
                  }
                  alt={tx.type}
                  width={32}
                  height={32}
                />

                {/* Text */}
                <div>
                  <p className="font-medium capitalize">
                    {tx.type === "deposit"
                      ? "Manual Deposit"
                      : tx.type === "interest"
                      ? "Interest Payment"
                      : "Withdrawal"}
                  </p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>

              {/* Right side: Amount */}
              <div className="text-right">
                <p className="font-semibold">₦{tx.amount.toLocaleString()}</p>
                <p
                  className={`text-xs ${
                    tx.type === "withdrawal"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {tx.type === "withdrawal" ? "Pending" : "Successful"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
      />
      <LiquidatePopup
        isOpen={showLiquidatePopup}
        onClose={() => setShowLiquidatePopup(false)}
        planStatus={plan.status}
      />
    </main>
  );
}
