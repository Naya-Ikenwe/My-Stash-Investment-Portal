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
  status: "PENDING" | "ACTIVE" | "MATURED" | "CLOSED";
  userId: string;
  lastRoiDisbursedAt: string | null;
  lastLiquidatedAt: string | null;
  nextRoiDueAt: string | null;
  closedDate: string | null;
  totalAccruedRoi: number;
  parentPlanId?: string;
}

export interface InstantTransferDetails {
  bankAccountNumber: string;
  bankName: string;
  bankAccountName: string;
  channel: string;
  expiresIn: string;
  amount: number;
  fee: number;
  net: number;
  reference: string;
  checkoutUrl: string;
}

export interface BankTransferDetails {
  bankAccountNumber: string;
  bankName: string;
  bankAccountName: string;
  channel: string;
  amount: number;
  reference: string;
}

export interface CreatePlanResponse {
  data: {
    plan: PlanResponse;
    payment: {
      instantTransfer: InstantTransferDetails;
      bankTransfer: BankTransferDetails;
    };
  };
  message: string;
  status: string;
}

// ----------------------
// TOP-UP PLAN INTERFACE
// ----------------------
export interface TopUpPlanResponse {
  message: string;
  status: string;
  data: {
    payment: {
      instantTransfer: InstantTransferDetails;
      bankTransfer: BankTransferDetails;
    };
  };
}

// ----------------------
// CALCULATE PLAN SUMMARY INTERFACE
// ----------------------
export interface PlanSummaryRequest {
  duration: number;
  payoutFrequency: string;
  principal: number;
}

export interface PlanSummaryData {
  principal: number;
  duration: number;
  roiRate: number;
  payoutFrequency: string;
  expectedMaturityDate: string;
  totalExpectedReturns: number;
  expectedRoiGross: number;
  expectedRoi: number;
  withholdingTax: number;
  withholdingTaxRate: number;
  payoutPerPeriod: number;
  numberOfPayouts: number;
}

export interface CalculatePlanSummaryResponse {
  message: string;
  status: string;
  data: PlanSummaryData;
}

// ----------------------
// CREATE PLAN
// ----------------------
export const createPlan = async (payload: PlanFormData) => {
  const response = await API.post<CreatePlanResponse>("/plan", payload);
  return response.data;
};

// ----------------------
// GET PLAN PAYMENT DETAILS (for pending plans)
// ----------------------
export const getPlanPaymentDetails = async (planId: string) => {
  const response = await API.get<CreatePlanResponse>(`/plan/${planId}/payment`);
  return response.data;
};

// ----------------------
// CALCULATE PLAN SUMMARY
// ----------------------
export const calculatePlanSummary = async (payload: PlanSummaryRequest) => {
  const response = await API.post<CalculatePlanSummaryResponse>(
    "/plan/calculate-summary",
    payload
  );
  return response.data;
};

// ----------------------
// TOP-UP PLAN
// ----------------------
export interface TopUpRequest {
  amount: number;
}

export interface TopUpData {
  id: string;
  newPrincipal: number;
  paymentReference: string;
  previousPrincipal: number;
  topUpAmount: number;
  planId: string;
  transactionId: string;
  createdAt: string;
  transaction: {
    id: string;
    amount: number;
    intent: string;
    direction: string;
    reference: string;
  };
}

export interface TopUpResponse {
  message: string;
  status: string;
  data: {
    payment: {
      instantTransfer: InstantTransferDetails;
      bankTransfer: BankTransferDetails;
    };
    topUp: TopUpData;
  };
}

export const topUpPlan = async (planId: string, amount: number) => {
  const response = await API.post<TopUpResponse>(
    `/plan/${planId}/top-up`,
    { amount }
  );
  return response.data;
};

// ----------------------
// ROLLOVER PLAN
// ----------------------
export interface RolloverRequest {
  rolloverType: "PRINCIPAL_ONLY" | "PRINCIPAL_AND_INTEREST";
}

export interface RolloverResponse {
  message: string;
  status: string;
  data: {
    plan: PlanResponse;
    payment: {
      instantTransfer: InstantTransferDetails;
      bankTransfer: BankTransferDetails;
    };
  };
}

export const rolloverPlan = async (
  planId: string,
  rolloverType: "PRINCIPAL_ONLY" | "PRINCIPAL_AND_INTEREST"
) => {
  const response = await API.post<RolloverResponse>(`/plan/${planId}/rollover`, {
    rolloverType,
  });
  return response.data;
};

// ----------------------
// LIQUIDATE PLAN
// ----------------------
export interface LiquidateRequest {
  amount: number;
  isFull: boolean;
}

export interface LiquidateData {
  id: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  corporateUserId: string;
  createdAt: string;
  planId: string;
  netPayout: number;
  roiAccrued: number;
  roiNet: number;
  roiPenalty: number;
  withholdingTax: number;
  remainingPrincipal: number;
  bankAccountId: string;
  type: "PARTIAL" | "FULL";
  transactionId: string;
  transaction: {
    id: string;
    amount: number;
    intent: string;
    direction: string;
    reference: string;
  };
}

export interface LiquidateResponse {
  message: string;
  status: string;
  data: LiquidateData;
}

export const liquidatePlan = async (planId: string, amount: number, isFull: boolean) => {
  const response = await API.post<LiquidateResponse>(
    `/plan/${planId}/liquidate`,
    { amount, isFull }
  );
  return response.data;
};

// ----------------------
// WITHDRAW PLAN
// ----------------------
export interface WithdrawResponse {
  message: string;
  status: string;
  data: {
    id: string;
    status: "CLOSED";
    closedDate: string;
    [key: string]: any;
  };
}

export const withdrawPlan = async (planId: string) => {
  const response = await API.post<WithdrawResponse>(
    `/plan/${planId}/withdraw`
  );
  return response.data;
};

// ----------------------// ACTIVATE PLAN (Make Payment for PENDING)
// ----------------------
export interface ActivatePlanResponse {
  message: string;
  status: string;
  data: {
    payment: {
      instantTransfer: InstantTransferDetails;
      bankTransfer: BankTransferDetails;
    };
  };
}

export const activatePlan = async (planId: string) => {
  const response = await API.post<ActivatePlanResponse>(
    `/plan/${planId}/activate`
  );
  return response.data.data.payment;
};

// ----------------------// GET ALL PLANS
// ----------------------
export const getAllPlans = async (page = 1, limit = 8) => {
  const response = await API.get(`/plan?page=${page}&limit=${limit}&sort=createdAt:desc`);
  
  console.log("🔍 API Response:", response.data);
  
  const results = response.data.data.results?.map((plan: any) => ({
    ...plan,
    principal: Number(plan.principal ?? 0),
    currentPrincipal: Number(plan.currentPrincipal ?? 0),
    totalAccruedRoi: Number(plan.totalAccruedRoi ?? 0),
  })) || [];
  
  const total = response.data.data.totalCount || 0;
  const totalPages = Math.ceil(total / limit);
  
  console.log("📊 Pagination:", { page, limit, total, totalPages, resultsLength: results.length });
  
  return {
    data: results,
    pagination: {
      page: response.data.data.page || page,
      limit: response.data.data.limit || limit,
      total,
      totalPages,
    }
  };
};

// GET PLAN BY ID
export const getPlanById = async (planId: string) => {
  // The interceptor will add _t timestamp, but we'll also add a cache-busting header
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
    console.log("🔄 [DEBUG] Making API call to /bank endpoint...");
    
    const response = await API.get<GetBankAccountsResponse>("/bank");
    
    console.log("✅ [DEBUG] API Response received successfully!");
    console.log("📊 [DEBUG] Response status:", response.data.status);
    console.log("📦 [DEBUG] Response data structure:", {
      hasMessage: !!response.data.message,
      hasStatus: !!response.data.status,
      hasData: !!response.data.data,
      resultsCount: response.data.data?.results?.length || 0,
      totalCount: response.data.data?.totalCount || 0
    });
    
    if (response.data.status === "success") {
      const bankAccounts = response.data.data?.results || [];
      
      console.log(`🎯 [DEBUG] Found ${bankAccounts.length} bank account(s)`);
      
      if (bankAccounts.length === 0) {
        console.log("ℹ️ [DEBUG] Results array is empty - no bank accounts");
        return []; // Return empty array, don't throw
      }
      
      // Log first bank account for verification
      if (bankAccounts[0]) {
        console.log("📋 [DEBUG] First bank account details:", {
          id: bankAccounts[0].id,
          accountNumber: bankAccounts[0].accountNumber,
          bankCode: bankAccounts[0].bankCode,
          accountName: bankAccounts[0].accountName || "(empty)"
        });
      }
      
      return bankAccounts;
    } else {
      console.warn("⚠️ [DEBUG] API returned non-success status:", response.data.status);
      console.warn("📝 [DEBUG] API message:", response.data.message);
      return []; // Return empty array, don't throw
    }
  } catch (error: any) {
    // Enhanced error logging
    console.error("🔴 [DEBUG] FULL ERROR DETAILS:");
    console.error("   Status Code:", error.response?.status || "No response");
    console.error("   Status Text:", error.response?.statusText || "N/A");
    console.error("   Error Message:", error.message);
    console.error("   Request URL:", error.config?.url || "Unknown");
    console.error("   Request Method:", error.config?.method || "Unknown");
    
    if (error.response?.data) {
      console.error("   Response Body:", error.response.data);
      console.error("   Response Message:", error.response.data?.message || "No message");
      console.error("   Response Status:", error.response.data?.status || "No status");
    }
    
    if (error.response?.headers) {
      console.error("   Response Headers:", error.response.headers);
    }
    
    // CRITICAL: Return empty array instead of throwing
    console.log("🟡 [DEBUG] Returning empty array (graceful fallback)");
    return [];
  }
};

// Optional: Add axios interceptors for debugging (add this once at app initialization)
// You can add this to your main app.tsx or layout.tsx
export const enableAPIDebugging = () => {
  API.interceptors.request.use((config) => {
    console.log("📤 [AXIOS REQUEST] Sending to:", config.url);
    console.log("   Method:", config.method);
    console.log("   Headers:", {
      Authorization: config.headers?.Authorization ? "Present" : "Missing",
      "Content-Type": config.headers?.["Content-Type"]
    });
    return config;
  });

  API.interceptors.response.use(
    (response) => {
      console.log("📥 [AXIOS RESPONSE] Received from:", response.config.url);
      console.log("   Status:", response.status, response.statusText);
      return response;
    },
    (error) => {
      console.error("❌ [AXIOS ERROR] From:", error.config?.url);
      console.error("   Status:", error.response?.status, error.response?.statusText);
      return Promise.reject(error);
    }
  );
};

// ----------------------
// CALCULATE LIQUIDATION SUMMARY
// ----------------------
export interface LiquidationSummary {
  liquidationAmount: number;
  currentPrincipal: number;
  totalRoiAccrued: number;
  proratedRoiAccrued: number;
  roiPenalty: number;
  withholdingTax: number;
  roiNet: number;
  netPayout: number;
  remainingPrincipal: number;
  liquidationType: "PARTIAL" | "FULL";
  roiPenaltyRate: number;
  withholdingTaxRate: number;
}

export interface CalculateLiquidationResponse {
  message: string;
  status: string;
  data: LiquidationSummary;
}

export const calculateLiquidationSummary = async (
  planId: string,
  amount: number,
  isFull: boolean
) => {
  const response = await API.post<CalculateLiquidationResponse>(
    `/plan/${planId}/calculate-liquidation-summary`,
    { amount, isFull }
  );
  return response.data;
};