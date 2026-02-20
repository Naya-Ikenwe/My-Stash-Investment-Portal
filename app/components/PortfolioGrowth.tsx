// app/components/PortfolioGrowth.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { DashboardResponse, getPortfolioHistory } from "@/app/api/dashboard";

type PortfolioGrowthProps = {
  dashboardData: DashboardResponse["data"] | null;
  isLoading?: boolean;
};

// Get all months of the year
const allMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Format timestamp to month (Jan, Feb, etc.)
const formatMonth = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short" });
};

// Format full timestamp for tooltip
const formatFullDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get date range for last 6 months
const getDateRange = () => {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 6);

  return {
    from: from.toISOString().split("T")[0], // YYYY-MM-DD
    to: to.toISOString(),
  };
};

const generateMonthlyTicks = (startDate: Date, endDate: Date) => {
  const ticks = [];

  let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  const last = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (current <= last) {
    ticks.push(current.getTime());
    current.setMonth(current.getMonth() + 1);
  }

  return ticks;
};

export default function PortfolioGrowth({
  dashboardData,
  isLoading = false,
}: PortfolioGrowthProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [rawData, setRawData] = useState<any[]>([]); // Store raw data for tooltip
  const [loading, setLoading] = useState(true);
  const currentDate = new Date();
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 6,
    1,
  );
  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const [error, setError] = useState<string | null>(null);
  const monthlyTicks = generateMonthlyTicks(startDate, endDate);

  useEffect(() => {
    const fetchPortfolioHistory = async () => {
      try {
        setLoading(true);
        const { from, to } = getDateRange();

        const response = await getPortfolioHistory(from, to, "day");

        if (response?.data?.portfolioValue) {
          console.log(response.data.portfolioValue);

          const data = response.data.portfolioValue.map((point) => ({
            value: point.value,
            timestamp: new Date(point.timestamp).getTime(),
          }));
          // Store raw data for tooltip
          setChartData(data);
        }
      } catch (err) {
        console.error("Failed to fetch portfolio history:", err);
        setError("Could not load portfolio history");
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) {
      fetchPortfolioHistory();
    }
  }, [isLoading]);

  if (isLoading || loading) {
    return (
      <div className="bg-white p-4 rounded-2xl h-full">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error || chartData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-2xl h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold">Portfolio Growth</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#10B981]">
              +
              {(
                dashboardData?.portfolio.portfolioGrowthPercentage || 0
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">No portfolio history available</p>
        </div>
      </div>
    );
  }

  const growthPercentage =
    dashboardData?.portfolio.portfolioGrowthPercentage || 0;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900">
            {dataPoint.timestamp
              ? formatFullDate(dataPoint.timestamp)
              : "No data"}
          </p>
          <p className="text-sm text-[#A243DC] font-medium">
            Value: ₦{dataPoint.value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-2xl h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold">Portfolio Growth</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#10B981]">
            +{growthPercentage.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              tickLine={false}
              type="number"
              domain={[startDate.getTime(), endDate.getTime()]} // Set domain to last 6 months
              tick={{ fill: "#666" }}
              ticks={monthlyTicks} // Use generated monthly ticks
              tickFormatter={(tick) =>
                new Date(tick).toLocaleDateString("en-US", {
                  month: "short",
                })
              }
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666" }}
              tickFormatter={(value) => `₦${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#A243DC"
              strokeWidth={3}
              dot={{ fill: "#A243DC", r: 4 }}
              activeDot={{ r: 6, fill: "#A243DC" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
