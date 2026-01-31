"use client";

import CardWrapper from "./CardWrapper";
import { IoIosArrowBack } from "react-icons/io";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { CreateFormPlanProps, PlanFormData, BankAccount } from "../types/plan";
import { useState, useEffect } from "react";
import { getBankAccounts } from "../api/Plan"; // Correct import

export default function CreatePlanForm({
  onBack,
  onContinue,
  form,
}: CreateFormPlanProps) {
  const { control, handleSubmit, watch, setValue, getValues } = form;
  const rolloverValue = watch("rollover");
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [bankError, setBankError] = useState<string | null>(null);

  // Fetch banks on component mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setIsLoadingBanks(true);
        console.log("🔄 Fetching bank accounts...");

        // getBankAccounts now returns BankAccount[]
        const bankAccounts: BankAccount[] = await getBankAccounts();

        console.log("✅ Bank accounts fetched:", bankAccounts);
        setBanks(bankAccounts);

        // Auto-select first bank if available
        if (bankAccounts.length > 0) {
          setValue("payoutAccountId", bankAccounts[0].id);
          console.log("⚡ Auto-selected first bank ID:", bankAccounts[0].id);
        } else {
          console.log("⚠️ No bank accounts available");
        }
      } catch (error: any) {
        console.error("❌ Failed to fetch banks:", error);
        setBankError(
          error?.message || "Failed to load bank accounts. Please try again."
        );
      } finally {
        setIsLoadingBanks(false);
        console.log("🏁 Finished loading banks");
      }
    };

    fetchBanks();
  }, [setValue]);

  const onSubmit = (data: PlanFormData) => {
    const { duration, startDate } = getValues();

    const endDate =
      duration === 6
        ? new Date(startDate).setMonth(new Date(startDate).getMonth() + 6)
        : new Date(startDate).setMonth(new Date(startDate).getMonth() + 12);

    setValue("endDate", endDate);

    console.log("Form data with selected bank:", data);
    onContinue();
  };

  return (
    <main className="flex items-center -my-10">
      <CardWrapper className="flex flex-col items-center justify-center p-10 gap-8 w-[700px] min-h-[450px] relative">
        <button
          onClick={onBack}
          className="bg-[#E7E7E7] p-2 rounded-full absolute top-5 left-5 cursor-pointer"
        >
          <IoIosArrowBack />
        </button>

        <p className="text-2xl font-medium">Hi, create your portfolio</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
          {/* Plan Name */}
          <div>
            <label htmlFor="name">Give your plan a name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  required
                  className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
                />
              )}
            />
          </div>

          {/* Principal */}
          <div>
            <label htmlFor="principal">How much do you want to fund?</label>
            <Controller
              name="principal"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  required
                  className="bg-white h-12 mt-2"
                />
              )}
            />
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration">Select duration</label>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                  required
                >
                  <SelectTrigger className="w-full bg-white min-h-12 mt-2 py-0">
                    <SelectValue className="text-black" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel>Select duration</SelectLabel>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Bank Account Selection */}
          <div>
            <label htmlFor="payoutAccountId">Select Bank Account</label>
            {bankError && (
              <div className="text-red-500 text-sm mt-1">{bankError}</div>
            )}
            <Controller
              name="payoutAccountId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  required
                  disabled={isLoadingBanks || banks.length === 0}
                >
                  <SelectTrigger className="w-full bg-white min-h-12 mt-2 py-0">
                    {isLoadingBanks ? (
                      <SelectValue placeholder="Loading banks..." />
                    ) : banks.length === 0 ? (
                      <SelectValue placeholder="No bank accounts found" />
                    ) : (
                      <SelectValue placeholder="Select a bank account" />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel>Your Bank Accounts</SelectLabel>
                      {banks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {bank.accountName || "No account name"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {bank.accountNumber} • {bank.bankCode}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {!isLoadingBanks && banks.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Selected bank will be used for payouts and returns
              </p>
            )}
          </div>

          {/* Rollover Toggle */}
          <div className="mt-4 p-4 border border-[#2323231A] rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium text-gray-800">Reinvestment Settings</h3>
                <p className="text-sm text-gray-600">
                  Configure what happens when your plan matures
                </p>
              </div>
              <Controller
                name="rollover"
                control={control}
                render={({ field }) => (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A243DC] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A243DC]"></div>
                  </label>
                )}
              />
            </div>

            <p className="text-sm text-gray-700 mb-3">
              {rolloverValue 
                ? "Your funds will be automatically reinvested when the plan matures"
                : "Your funds will be returned to your payout account when the plan matures"}
            </p>

            {/* Rollover Type */}
            {rolloverValue && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reinvestment Type
                </label>
                <Controller
                  name="rolloverType"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="rolloverType" 
                          value="PRINCIPAL_ONLY"
                          checked={field.value === "PRINCIPAL_ONLY"}
                          onChange={() => field.onChange("PRINCIPAL_ONLY")}
                          className="mr-2"
                        />
                        <span className="text-sm">Principal Only</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="rolloverType" 
                          value="PRINCIPAL_AND_INTEREST"
                          checked={field.value === "PRINCIPAL_AND_INTEREST"}
                          onChange={() => field.onChange("PRINCIPAL_AND_INTEREST")}
                          className="mr-2"
                        />
                        <span className="text-sm">Principal & Interest</span>
                      </label>
                    </div>
                  )}
                />
              </div>
            )}
          </div>

          <Input
            type="submit"
            value={"Continue"}
            disabled={isLoadingBanks || banks.length === 0}
            className={`bg-[#A243DC] text-white mt-5 cursor-pointer hover:bg-[#8a38c2] transition-colors ${
              (isLoadingBanks || banks.length === 0) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </form>
      </CardWrapper>

      <div>
        <Image
          src={"/plan-form.svg"}
          alt="illustration"
          width={200}
          height={200}
          className="w-full h-auto"
        />
      </div>
    </main>
  );
}
