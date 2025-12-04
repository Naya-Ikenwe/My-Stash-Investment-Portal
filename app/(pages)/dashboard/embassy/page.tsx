"use client";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function EmbassyPage() {
  return (
    <main>
      <p className="font-medium text-[32px] text-[#A243DC]">Embassy Request</p>

      <hr className="border border-[#455A6433] rounded-md mt-5" />

      <p className="mt-5 font-medium text-[16px] text-[#263238]">
        Request an Embassy Letter
      </p>

      <div className="flex flex-col items-center justify-center mt-5">
        <div className="relative w-[496px]">
          <input
            type="text"
            name="text"
            placeholder="Select Embassy"
            className="w-full h-[60px] border rounded-xl border-[#CDCFD0] placeholder:text-[#303437] px-5 pr-12"
          />

          <RiArrowDropDownLine className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-[#303437] text-3xl" />
        </div>

        <div className="flex justify-between w-[496px] mt-5">
          <div className="relative">
            <input
              type="text"
              name="text"
              placeholder="Start Date"
              className="w-[229px] h-[60px] border border-[#CDCFD0] placeholder:text-[#303437] font-medium text-[14px] px-5 rounded-xl"
            />
            <RiArrowDropDownLine className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-[#303437] text-3xl" />
          </div>

          <div className="relative">
            <input
              type="text"
              name="text"
              placeholder="End Date"
              className="w-[229px] h-[60px] border border-[#CDCFD0] placeholder:text-[#303437] font-medium text-[14px] px-5 rounded-xl"
            />
            <RiArrowDropDownLine className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-[#303437] text-3xl" />
          </div>
        </div>

        <div className="flex justify-between items-center w-[496px] mt-5">
          <p className="text-[16px] text-[#6C7072]">
            Agree to embassy request terms & conditions
          </p>

          <input type="checkbox" name="checkbox" className="w-5 cursor-pointer h-5" />
        </div>

        <div className="bg-[#F4F6F7] w-[496px] h-[253px] mt-5 rounded-xl p-4">
          <textarea
            className="w-[496px] h-[253px] bg-transparent outline-none resize-none text-[#303437]"
            placeholder="Special request"
          ></textarea>
        </div>
        <div className="w-[496px] flex justify-end">
          <button className="bg-[#A243DC] cursor-pointer w-[184px] h-[38px] rounded-xl text-white font-medium text-[16px] mt-5">
            Submit
          </button>
        </div>
      </div>
    </main>
  );
}
