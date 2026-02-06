// app/dashboard/transaction-history/components/TransactionStats.tsx
"use client";

import { useEffect, useState } from "react";
import { getTransactionsService } from "@/app/api/Users";

type StatsCard = {
  title: string;
  value: string;
  filterValue: string;
  color: string;
};

type TransactionStatsProps = {
  filters: any;
  onFilterChange: (filters: any) => void;
};

const TransactionStats = ({ filters, onFilterChange }: TransactionStatsProps) => {
  const [stats, setStats] = useState<StatsCard[]>([
    { title: "Total", value: "0", filterValue: "", color: "bg-blue-500" },
    { title: "Success", value: "0", filterValue: "SUCCESS", color: "bg-green-500" },
    { title: "Pending", value: "0", filterValue: "PENDING", color: "bg-yellow-500" },
    { title: "Failed", value: "0", filterValue: "FAILED", color: "bg-red-500" },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch totals for each status
        const promises = stats.map(async (stat) => {
          if (stat.filterValue) {
            const response = await getTransactionsService({
              ...filters,
              status: stat.filterValue,
              limit: 1,
              page: 1
            });
            return {
              ...stat,
              value: response.data.totalCount.toLocaleString()
            };
          }
          return stat;
        });

        // Fetch total count
        const totalResponse = await getTransactionsService({
          ...filters,
          limit: 1,
          page: 1
        });

        // Calculate total amount from first page
        const amountResponse = await getTransactionsService({
          ...filters,
          limit: 50,
          page: 1
        });
        const total = amountResponse.data.results.reduce(
          (sum: number, t: any) => sum + t.amount, 
          0
        );

        const updatedStats = await Promise.all(promises);
        updatedStats[0].value = totalResponse.data.totalCount.toLocaleString();
        
        setStats(updatedStats);
        setTotalAmount(total);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => (
        <button
          key={stat.title}
          onClick={() => {
            if (stat.filterValue) {
              onFilterChange({ ...filters, status: stat.filterValue });
            } else {
              const { status, ...rest } = filters;
              onFilterChange(rest);
            }
          }}
          className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow ${
            filters.status === stat.filterValue ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-3 h-8 ${stat.color} rounded-full`}></div>
            <div className="text-left">
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </button>
      ))}
      
      {/* Total Amount */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-8 bg-purple-500 rounded-full"></div>
          <div className="text-left">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold">₦{totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStats;