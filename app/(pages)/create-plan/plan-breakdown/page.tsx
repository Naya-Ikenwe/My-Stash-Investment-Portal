"use client";

import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CardWrapper from "@/app/components/CardWrapper";
import FundSource from "@/app/components/FundSource";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

export default function PlanBreakdownPage() {
  type Breakdown = {
    name: string;
    amount: number;
  };

  const initial: Breakdown[] = [
    { name: "August Interest", amount: 174171 },
    { name: "August Witholding Tax", amount: 1741 },
    { name: "August Net Interest", amount: 156771 },
  ];

  const subsequently: Breakdown[] = [
    { name: "Interest", amount: 2000000 },
    { name: "Witholding Tax", amount: 2000 },
    { name: "Net Interest", amount: 18000 },
  ];

  const total: Breakdown[] = [
    { name: "Interest", amount: 117475 },
    { name: "Witholding Tax", amount: 1174 },
    { name: "Net Interest", amount: 105677 },
  ];

  const [fundSourceOpen, setFundSourceOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <>
      <AuthWrapper>
        <CardWrapper className="max-w-4xl mx-auto px-20 py-8 relative flex flex-col gap-8">
          <div className="absolute top-5 left-5 p-2 bg-[#E7E7E7] rounded-full">
            <IoIosArrowBack size={18} />
          </div>

          <div className="flex flex-col items-center gap-5 text-center">
            <div>
              <h2 className="text-2xl font-medium">Investment Breakdown</h2>
              <p className="text-primary">
                Kindly see investments terms & details below
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                {" "}
                <p className="text-3xl font-bold">₦100000</p>
                <p>
                  Interest rate:{" "}
                  <span className="text-[#44C56F]">
                    24% per anum (2% per month)
                  </span>{" "}
                </p>
              </div>

              <div className="flex gap-4 items-center">
                <span className="flex gap-2 items-center">
                  <FaCircle />
                  <p>Start Date: Aug 4, 2025</p>
                </span>

                <span className="flex gap-2 items-center">
                  <FaCircle className="text-primary" />
                  <p>End Date: Jan 31, 2026</p>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-[16px]">
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="mb-1.5 text-[#37474F] text-sm">Initial</h4>
                <hr className="border-[#455A6447]" />
              </div>

              <div className="flex flex-col gap-3">
                {initial.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between "
                  >
                    <p>{item.name}</p>
                    <p>₦{item.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h4 className="mb-1.5 text-[#37474F] text-sm">
                  Subsequently(Monthly)
                </h4>
                <hr className="border-[#455A6447]" />
              </div>

              <div className="flex flex-col gap-3">
                {subsequently.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <p>{item.name}</p>
                    <p>₦{item.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h4 className="mb-1.5 text-[#37474F] text-sm">Total</h4>
                <hr className="border-[#455A6447]" />
              </div>

              <div className="flex flex-col gap-3">
                {total.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <p>{item.name}</p>
                    <p>₦{item.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form className="flex flex-col gap-16">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-primary font-semibold">
                  Terms and Conition
                </h2>
                <p>
                  Before proceeding to fund your investment plan, please read
                  and agree to the terms & conditions below:{" "}
                  <Link href={"#"} className="font-semibold hover:underline">
                    Read More...
                  </Link>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  className="border-[#CDCFD0]"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                />

                <Label htmlFor="terms" className="text-sm">
                  {" "}
                  I have read and agree to the{" "}
                  <span className="italic">Terms & Conditions</span>{" "}
                </Label>
              </div>
            </div>

            <div className="flex items-center gap-4 text-center font-medium">
              <Link
                href={"#"}
                className="border border-primary text-primary w-full py-3 rounded-xl"
              >
                Go Back
              </Link>

              <button
                type="button"
                disabled={!termsAccepted}
                onClick={() => setFundSourceOpen(true)}
                className="bg-primary text-white w-full py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Agree & Continue
              </button>
            </div>
          </form>
        </CardWrapper>
      </AuthWrapper>

      {fundSourceOpen === true && (
        <FundSource onClose={() => setFundSourceOpen(false)} />
      )}
    </>
  );
}
