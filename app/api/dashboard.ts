// app/api/dashboard.ts
import API from "@/lib/axiosInstance";

export type DashboardResponse = {
  status: string;
  message: string;
  data: {
    portfolio: {
      totalInvested: number;
      currentPortfolioValue: number;
      totalPortfolioValue: number;
      totalReturns: number;
      availableBalance: number;
      portfolioGrowth: number;
      portfolioGrowthPercentage: number;
    };
    plans: {
      total: number;
      active: number;
      pending: number;
      matured: number;
      completed: number;
    };
    performance: {
      averageRoiRate: number;
      totalRoiEarned: number;
      roiPaidOut: number;
      pendingRoi: number;
    };
    transactions: {
      totalDeposits: number;
      totalWithdrawals: number;
    };
    insights: {
      largestInvestment: number;
      latestPlanStartDate: string;
      nextMaturityDate: string;
      nextRoiDueAt: string;
    };
  };
};

// Portfolio History Types
export interface PortfolioHistoryPoint {
  value: number;
  timestamp: string;
}

export interface PortfolioHistoryResponse {
  message: string;
  status: string;
  data: {
    portfolioValue: PortfolioHistoryPoint[];
    totalInvested: PortfolioHistoryPoint[];
    accruedRoi: PortfolioHistoryPoint[];
    performanceIndex: PortfolioHistoryPoint[];
  };
}

// Portfolio Comparison Types
export type ComparisonPoint = {
  value: number;
  timestamp: string;
};

export type ComparisonChange = {
  change: number;
  percentage: number;
};

export type ComparisonData = {
  current: ComparisonPoint;
  past: ComparisonPoint;
  change: ComparisonChange;
};

export type ComparisonResponse = {
  message: string;
  status: string;
  data: ComparisonData;
};

export type MetricType = 'PORTFOLIO_VALUE' | 'TOTAL_INVESTED' | 'ACCRUED_ROI' | 'PERFORMANCE_INDEX';
export type EntityType = 'USER' | 'PLAN';

// Get Dashboard Data
export const getDashboardData = async (): Promise<DashboardResponse> => {
  const res = await API.get("/dashboard");
  return res.data;
};

// Get Portfolio History
export const getPortfolioHistory = async (
  from: string, 
  to: string, 
  resolution: 'day' | 'week' | 'month' = 'month'
) => {
  const response = await API.get<PortfolioHistoryResponse>(
    `/portfolio/history?from=${from}&to=${to}&resolution=${resolution}`
  );
  return response.data;
};

// Get Portfolio Comparison
export const getPortfolioComparison = async (
  from: string,
  entityType: EntityType,
  entityId: string,
  metricType: MetricType
) => {
  const response = await API.get<ComparisonResponse>(
    `/portfolio/comparison?from=${from}&entityType=${entityType}&entityId=${entityId}&metricType=${metricType}`
  );
  return response.data;
};