// app/components/PortfolioGrowth.tsx
"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { DashboardResponse } from "@/app/api/dashboard";

type PortfolioGrowthProps = {
  dashboardData: DashboardResponse['data'] | null;
  isLoading?: boolean;
};

// Mock chart data
const chartData = [
  { month: 'Jan', value: 400000 },
  { month: 'Feb', value: 420000 },
  { month: 'Mar', value: 380000 },
  { month: 'Apr', value: 450000 },
  { month: 'May', value: 480000 },
  { month: 'Jun', value: 530000 },
];

export default function PortfolioGrowth({ 
  dashboardData, 
  isLoading = false 
}: PortfolioGrowthProps) {
  
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-2xl h-full">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  const growthPercentage = dashboardData?.portfolio.portfolioGrowthPercentage || 0;

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
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666' }}
              tickFormatter={(value) => `₦${(value / 1000)}k`}
            />
            <Tooltip 
              formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Value']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#A243DC" 
              strokeWidth={3}
              dot={{ fill: '#A243DC', r: 4 }}
              activeDot={{ r: 6, fill: '#A243DC' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}