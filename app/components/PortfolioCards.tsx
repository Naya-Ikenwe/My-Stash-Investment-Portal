// app/components/PortfolioCards.tsx
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { DashboardResponse } from "@/app/api/dashboard";

type PortfolioCardsProps = {
  dashboardData: DashboardResponse["data"] | null;
  isLoading?: boolean;
  error?: string | null;
};

export default function PortfolioCards({
  dashboardData,
  isLoading = false,
  error = null,
}: PortfolioCardsProps) {
  const cards = [
    {
      name: "Portfolio Balance",
      value: dashboardData?.portfolio?.currentPortfolioValue || 0,
      isCurrency: true,
    },
    {
      name: "Returns to Date",
      value: dashboardData?.portfolio?.totalReturns || 0,
      isCurrency: true,
    },
    {
      name: "Active Plans",
      value: dashboardData?.plans?.active || 0,
      isCurrency: false, // 👈 IMPORTANT
    },
  ];

  if (isLoading) {
    return (
      <main className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full h-32 rounded-2xl bg-gray-200 animate-pulse"
          />
        ))}
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-full px-2 py-5 rounded-2xl bg-[#FAF1FF] border border-[#A243DC] flex flex-col gap-1"
          >
            <p className="text-[#A243DC]">{card.name}</p>
            <p className="text-gray-400 text-sm">Failed to load</p>
          </div>
        ))}

        <Link
          href={"/create-plan"}
          className="bg-primary text-white flex flex-col gap-3 items-center justify-center w-full rounded-2xl"
        >
          <FaPlus size={24} />
          <p>Create New Plan</p>
        </Link>
      </main>
    );
  }

  return (
    <main className="flex gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="w-full px-2 py-5 rounded-2xl bg-[#FAF1FF] border border-[#A243DC] flex flex-col gap-1"
        >
          <p className="text-[#A243DC]">{card.name}</p>

          <h2 className="text-[#263238] text-2xl font-medium">
            {card.isCurrency
              ? `₦${Number(card.value).toLocaleString()}`
              : Number(card.value).toLocaleString()}
          </h2>
        </div>
      ))}

      <Link
        href={"/create-plan"}
        className="bg-primary text-white flex flex-col gap-3 items-center justify-center w-full rounded-2xl"
      >
        <FaPlus size={24} />
        <p>Create New Plan</p>
      </Link>
    </main>
  );
}
