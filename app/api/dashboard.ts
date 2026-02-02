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

export const getDashboardData = async (): Promise<DashboardResponse> => {
  const res = await API.get("/dashboard");
  return res.data;
};