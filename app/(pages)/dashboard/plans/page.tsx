import { RiArrowDropDownLine } from "react-icons/ri";
import { savings } from "@/data/PlansData";
import Link from "next/link";

export default function PlansPage() {
  return (
    <main className="w-full h-full rounded-[14px]">
      <h1 className="text-[32px] font-medium text-[#A243DC]">My Plans</h1>
      <hr className="border border-[#455A6433] rounded-md mt-5" />

      {/* Filters */}
      <div className="">
        <div className="w-[326px] flex h-8 mt-5 gap-4">
          <div className="h-8 flex mx-auto w-[91px] py-1 px-2 bg-[#F7F7F7] text-center">
            Status <RiArrowDropDownLine />
          </div>
          <div className="h-8 w-[85px] py-1 px-2 bg-[#F7F7F7] text-center">
            Tenor
          </div>
          <div className="h-8 w-[118px] py-1 px-2 bg-[#F7F7F7] text-center">
            Date Range
          </div>
        </div>
      </div>

      {/* 🔵 Savings List goes here */}
      <div className="w-full h-full bg-[#F7F7F7] mt-5 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {savings.map((item) => (
            <Link href={`/dashboard/plans/${item.id}`} key={item.id}>
              <div className="w-full h-full px-5 py-10 border rounded-xl shadow-sm bg-white relative cursor-pointer hover:shadow-md transition">
                <span
                  className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full ${
                    item.status === "Active"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.status}
                </span>

                <h2 className="text-lg font-semibold">{item.title}</h2>

                <p className="text-xl text-[#455A64] font-bold mt-2">
                  ₦{item.amount.toLocaleString()}
                </p>

                <div className="flex justify-between mt-9">
                  <p className="text-[#263238] font-semibold text-[12px] leading-[125%] mt-1">
                    {item.plan}
                  </p>

                  <div className="">
                    <p className="text-[#37474F] flex flex-col text-sm">
                      Mtr.Date
                    </p>
                    <p className="text-[#37474F] flex flex-col text-sm">
                      {item.maturityDate}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
