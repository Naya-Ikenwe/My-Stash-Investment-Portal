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
// TOP-UP PLAN INTERFACE
// ----------------------
export interface TopUpPlanResponse {
  message: string;
  status: string;
  data: {
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
}

// ----------------------
// CREATE PLAN
// ----------------------
export const createPlan = async (payload: PlanFormData) => {
  const response = await API.post<CreatePlanResponse>("/plan", payload);
  return response.data;
};

// ----------------------
// TOP-UP PLAN
// ----------------------
export const topUpPlan = async (planId: string, amount: number) => {
  const response = await API.post<TopUpPlanResponse>(
    `/plan/${planId}/top-up`,
    { amount }
  );
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