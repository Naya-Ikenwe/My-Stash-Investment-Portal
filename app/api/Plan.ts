// app/api/Plan.ts
import API from "@/lib/axiosInstance";
import { PlanFormData, BankAccount } from "../types/plan";

// ----------------------
// PLAN INTERFACES
// ----------------------
export interface PlanResponse {
  id: string;
  payoutAccountId: string;
  name: string;
  corporateUserId: string;
  maturityDate: string;
  createdAt: string;
  updatedAt: string;
  currentPrincipal: number;
  duration: number;
  payoutFrequency: string;
  principal: number;
  roiRate: number;
  roiType: string;
  rolloverType: "PRINCIPAL_ONLY" | "PRINCIPAL_AND_INTEREST";
  startDate: string;
  status: "PENDING" | "ACTIVE" | "MATURED";
  userId: string;
  lastRoiDisbursedAt: string | null;
  lastLiquidatedAt: string | null;
  nextRoiDueAt: string | null;
  closedDate: string | null;
  totalAccruedRoi: number;
  parentPlanId?: string;
}

export interface CreatePlanResponse {
  data: {
    plan: PlanResponse;
    payment: {
      bankAccountNumber: string;
      bankName: string;
      channel: string;
      expiresIn: string;
      bankAccountName: string;
      amountToPay: number;
      reference: string;
    };
  };
  message: string;
  status: string;
}

// ----------------------
// CREATE PLAN
// ----------------------
export const createPlan = async (payload: PlanFormData) => {
  const response = await API.post<CreatePlanResponse>("/plan", payload);
  return response.data;
};

// ----------------------
// GET ALL PLANS (optional pagination)
// ----------------------
export const getAllPlans = async (page = 1, limit = 20) => {
  const response = await API.get(`/plan?page=${page}&limit=${limit}`);
  return response.data.data.results.map((plan: any) => ({
    ...plan,
    // Force numeric conversion
    principal: Number(plan.principal ?? 0),
    currentPrincipal: Number(plan.currentPrincipal ?? 0),
    totalAccruedRoi: Number(plan.totalAccruedRoi ?? 0),
  }));
};

// ----------------------
// GET PLAN BY ID
// ----------------------
export const getPlanById = async (planId: string) => {
  const response = await API.get<{ message: string; status: string; data: PlanResponse }>(
    `/plan/${planId}`
  );
  return response.data.data;
};

// ----------------------
// GET BANK ACCOUNTS
// ----------------------
export interface GetBankAccountsResponse {
  message: string;
  status: string;
  data: {
    limit: number;
    page: number;
    totalCount: number;
    results: BankAccount[];
  };
}

export const getBankAccounts = async (): Promise<BankAccount[]> => {
  try {
    const response = await API.get<GetBankAccountsResponse>("/bank"); // adjust endpoint if needed
    const bankAccounts = response.data.data.results || [];
    return bankAccounts;
  } catch (error: any) {
    console.error("❌ Failed to fetch bank accounts:", error);
    throw new Error(error?.response?.data?.message || "Could not fetch banks");
  }
};
