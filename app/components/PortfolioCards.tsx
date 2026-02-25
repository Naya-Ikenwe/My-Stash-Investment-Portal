// app/components/PortfolioCards.tsx
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { DashboardResponse, getPortfolioComparison, ComparisonData } from "@/app/api/dashboard";
import { useState, useEffect } from "react";

type PortfolioCardsProps = {
  dashboardData: DashboardResponse["data"] | null;
  userId?: string;
  isLoading?: boolean;
  error?: string | null;
};

export default function PortfolioCards({
  dashboardData,
  userId,
  isLoading = false,
  error = null,
}: PortfolioCardsProps) {
  const [portfolioComparison, setPortfolioComparison] = useState<ComparisonData | null>(null);
  const [returnsComparison, setReturnsComparison] = useState<ComparisonData | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(true);

  // Get date for "from" parameter (1 month ago)
  const getFromDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  };

  // Fetch comparison data
  useEffect(() => {
    const fetchComparisons = async () => {
      if (!userId || !dashboardData) return;
      
      try {
        setComparisonLoading(true);
        const fromDate = getFromDate();


        
        // Fetch portfolio value comparison
        try {
          const portfolioRes = await getPortfolioComparison(
            fromDate,
            'USER',
            userId,
            'PORTFOLIO_VALUE'
          );

          setPortfolioComparison(portfolioRes.data);
        } catch (err) {
          console.error("Portfolio comparison failed:", err);
          setPortfolioComparison(null);
        }
        
        // Fetch returns comparison
        try {
          const returnsRes = await getPortfolioComparison(
            fromDate,
            'USER',
            userId,
            'ACCRUED_ROI'
          );

          setReturnsComparison(returnsRes.data);
        } catch (err) {

          setReturnsComparison(null);
        }
        
      } catch (err) {
        console.error("Failed to fetch comparison data:", err);
      } finally {
        setComparisonLoading(false);
      }
    };

    fetchComparisons();
  }, [dashboardData, userId]);

  // Helper to render trend indicator
  const renderTrend = (comparison: ComparisonData | null) => {
    if (!comparison || comparison.change.percentage === 0) {
      return <p className="text-xs text-gray-400 mt-1">No change from last month</p>;
    }

    const isPositive = comparison.change.percentage > 0;
    const percentage = Math.abs(comparison.change.percentage).toFixed(1);
    
    return (
      <div className="flex items-center gap-1 mt-1">
        {isPositive ? (
          <>
            <FiArrowUp className="text-green-500" size={14} />
            <p className="text-xs text-green-500">+{percentage}%</p>
          </>
        ) : (
          <>
            <FiArrowDown className="text-red-500" size={14} />
            <p className="text-xs text-red-500">-{percentage}%</p>
          </>
        )}
        <p className="text-xs text-gray-400">from last month</p>
      </div>
    );
  };

  const cards = [
    {
      name: "Portfolio Balance",
      value: dashboardData?.portfolio?.currentPortfolioValue || 0,
      isCurrency: true,
      comparison: portfolioComparison,
    },
    {
      name: "Returns to Date",
      value: dashboardData?.portfolio?.totalReturns || 0,
      isCurrency: true,
      comparison: returnsComparison,
    },
    {
      name: "Active Plans",
      value: dashboardData?.plans?.active || 0,
      isCurrency: false,
    },
  ];

  if (isLoading || comparisonLoading) {
    return (
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-full px-4 py-5 rounded-2xl bg-[#FAF1FF] border border-[#A243DC] flex flex-col gap-1"
          >
            <p className="text-[#A243DC] text-sm">{card.name}</p>
            <p className="text-gray-400 text-sm">Failed to load</p>
          </div>
        ))}

        <Link
          href={"/create-plan"}
          className="bg-primary text-white flex flex-col gap-3 items-center justify-center w-full rounded-2xl py-5"
        >
          <FaPlus size={24} />
          <p className="text-sm">Create New Plan</p>
        </Link>
      </main>
    );
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="w-full px-4 py-5 rounded-2xl bg-[#FAF1FF] border border-[#A243DC] flex flex-col gap-1"
        >
          <p className="text-[#A243DC] text-sm">{card.name}</p>

          <h2 className="text-[#263238] text-xl lg:text-2xl font-medium truncate">
            {card.isCurrency
              ? `₦${Number(card.value).toLocaleString()}`
              : Number(card.value).toLocaleString()}
          </h2>
          
          {/* Trend indicator - only for Portfolio Balance and Returns to Date */}
          {card.comparison && renderTrend(card.comparison)}
        </div>
      ))}

      <Link
        href={"/create-plan"}
        className="bg-primary text-white flex flex-col gap-3 items-center justify-center w-full rounded-2xl py-5"
      >
        <FaPlus size={20} />
        <p className="text-sm">Create New Plan</p>
      </Link>
    </main>
  );
}