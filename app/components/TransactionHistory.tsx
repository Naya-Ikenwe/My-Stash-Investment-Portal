import Link from "next/link";
import { PiEmptyBold } from "react-icons/pi";

export default function TransactionHistory() {
  return (
    <div className="bg-[#F7F7F7] p-4 rounded-2xl w-full h-full flex flex-col gap-4">
      <div className="flex justify-between">
        <h3 className="">Transaction History</h3>
        <Link href={'/dashboard/transaction-history'}>Expand</Link>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white p-4 rounded-full">
            <PiEmptyBold className="text-[#455A64] inline-block" size={32} />
          </div>

          <p>Your transactions will appear here.</p>
        </div>
      </div>
    </div>
  );
}
