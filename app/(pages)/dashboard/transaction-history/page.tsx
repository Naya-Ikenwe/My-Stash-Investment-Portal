import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsDownload } from "react-icons/bs";
import { IoChevronBack } from "react-icons/io5";

export default function TransactionHistoryPage() {
  return (
    <main>
      <div className="flex flex-col gap-3">
        <Link href={"/dahboard"} className="flex items-center gap-2">
          <IoChevronBack /> <p>Back</p>
        </Link>

        <div className="flex items-center justify-between pb-2 border-b">
          <h2 className="text-primary text-lg font-semibold">Transaction History</h2>

          <Button>
            <BsDownload />
            Download Statement
          </Button>
        </div>
      </div>

      <div></div>
    </main>
  );
}
