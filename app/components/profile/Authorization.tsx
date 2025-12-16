"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { SiCommerzbank } from "react-icons/si";

export default function Authorization() {
  const { control } = useForm();

  return (
    <main className="pb-14">
      <div>
        <p className="text-[#455A64] font-medium text-[16px] mb-2">
          Authorization and Security
        </p>
        <hr className="border-[#455A6433]" />

        <p className="text-[#455A64] font-medium mt-8 mb-6">
          Enter the following details correctly
        </p>
      </div>

      <form action="" className="w-3/5 flex flex-col items-center">
        <div className="grid grid-cols-2 gap-5 w-full">
          <Controller
            name="bvn"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Bank Verification Number (BVN)"
                className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
              />
            )}
          />

          <Controller
            name="sourceOfIncome"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Source of Income"
                className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
              />
            )}
          />

          <Controller
            name="nin"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="NIN Number"
                className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
              />
            )}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full bg-white text-white min-h-12 mt-2 py-0">
                  <SelectValue
                    placeholder="Security Question"
                    className="text-black "
                  />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem value="school">Your primary school</SelectItem>
                    <SelectItem value="mum">
                      Mother&apos;s maiden name
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="securityAnswer"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Security Answer"
                className="bg-white shadow-none py-2 border-[#2323231A] h-12 mt-2"
              />
            )}
          />

          <Controller
            name="pin"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Set up PIN"
                className="bg-white h-12 mt-2"
              />
            )}
          />
        </div>

        <Input
          type="submit"
          value={"Save Changes"}
          className="bg-primary text-white mt-8 w-2/4"
        />
      </form>

      <div className="mt-6 flex flex-col gap-4">
        <h2 className="font-medium text-[16px] text-[#455A64]">
          Saved Bank Account Details
        </h2>

        <div className="grid grid-cols-4">
          <div className="flex items-center border py-2 px-3 rounded-md gap-3">
            <SiCommerzbank size={24} />

            <div>
              <h4>Access Bank</h4>
              <p className="text-xs">07**********34</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
