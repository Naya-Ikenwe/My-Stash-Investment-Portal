import { v4 as uuidv4 } from "uuid";
import API from "@/lib/axiosInstance";
import { BankAccount } from "../types/plan";

// Signup - updated with deviceName
export const signupService = async (payload: { 
  email: string; 
  password: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
  referralCode?: string;
  hearAboutUs?: string;
  deviceId: string;
  deviceName?: string;
}) => {
  const res = await API.post("/user/signup", payload);
  return res.data;
};

// Login - updated with deviceName
export const loginService = async (payload: { 
  email: string; 
  password: string;
  deviceId: string;
  deviceName?: string;
}) => {
  const res = await API.post("/user/login", payload);
  return res.data;
};

// User profile
export const userProfile = async () => {
  const res = await API.get("/user/profile");
  return res.data;
};

// Verify email
export const verifyEmailService = async (payload: { 
  email: string; 
  token: string;
}) => {
  const res = await API.post("/user/verify-email", payload);
  return res.data;
};

// Resend OTP
export const resendVerificationOtpService = async (payload: { 
  email: string;
}) => {
  const res = await API.post("/user/resend-verification", payload);
  return res.data;
};

// Get banks list
export const getBanksService = async () => {
  const res = await API.get("/payment/banks");
  return res.data;
};

// Forgot password
export const forgotPasswordService = async (payload: { 
  email: string;
}) => {
  const res = await API.post("/user/forgot-password", payload);
  return res.data;
};

// Reset password
export const resetPasswordService = async (payload: {
  email: string;
  token: string;
  newPassword: string;
}) => {
  const res = await API.post("/user/reset-password", payload);
  return res.data;
};

// Update user profile (general - for Personal.tsx component)
export const updateUserProfileService = async (payload: any) => {
  const res = await API.patch("/user/profile", payload);
  return res.data;
};

// Update user profile with optional profile picture (multipart/form-data)
export const updateProfileService = async (payload: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  title?: string;
  middleName?: string;
  gender?: string;
  maritalStatus?: string;
  address?: string;
  country?: string;
  dateOfBirth?: string;
  displayPhoto?: File | Blob | null;
}) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "displayPhoto") {
      const file = value as File | Blob;
      // If a File/Blob is provided, append with a filename when possible
      if (file instanceof File) {
        formData.append("displayPhoto", file, file.name);
      } else {
        formData.append("displayPhoto", file);
      }
    } else {
      formData.append(key, String(value));
    }
  });

  const res = await API.patch("/user/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Logout (optional - if your backend has a logout endpoint)
export const logoutService = async () => {
  const res = await API.post("/user/logout");
  return res.data;
};

// Refresh token
export const refreshTokenService = async () => {
  const res = await API.post("/user/refresh", {}, { withCredentials: true });
  return res.data;
};

// Update DOB & Gender specifically (for VerifyIdentityPage)
export const updateProfileDobGender = async (payload: {
  dateOfBirth: string;
  gender: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}) => {
  const res = await API.patch("/user/profile", payload);
  return res.data;
};

// Verify bank account
export const verifyBankAccount = async (payload: { 
  accountNumber: string; 
  bankCode: string;
}) => {
  const res = await API.post("/bank", payload);
  return res.data;
};

// ===== KYC SERVICES =====

// NEW: Update KYC information for Authorization page (doesn't require bvn)
export const updateKycInfoService = async (payload: {
  nin?: string;
  sourceOfIncome?: string;
  motherMaidenName?: string;
  bvn?: string;
}) => {
  const res = await API.patch("/user/kyc", payload);
  return res.data;
};

export const updateKycService = async (payload: {
  bvn: string;
  nin?: string;
  motherMaidenName?: string;
  sourceOfIncome?: string;
  meansOfIdentification?: string;
  proofOfAddress?: string;
  passportPhotograph?: string;
  digitalSignature?: string;
}) => {
  const res = await API.patch("/user/kyc", payload);
  return res.data;
};

// Upload KYC documents with files (FormData - for Kyc.tsx)
export const uploadKycDocumentsService = async (formData: FormData) => {
  const res = await API.patch("/user/kyc", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Get KYC documents
export const getKycDocumentsService = async () => {
  const res = await API.get("/user/kyc");
  return res.data;
};

// ===== END KYC SERVICES =====

// Get user profile (for Personal.tsx component)
export const getUserProfileService = async () => {
  const res = await API.get("/user/profile");
  return res.data;
};

// Change password
export const changePasswordService = async (payload: {
  oldPassword: string;
  newPassword: string;
}) => {
  const res = await API.post("/user/change-password", payload);
  return res.data;
};

/// Get user's saved security question
export const getSecurityQuestionsService = async () => {
  const res = await API.get("/security/security-question");
  return res.data;
};

// Set security question & answer
export const setSecurityAnswerService = async (payload: {
  questionId: string;
  answer: string;
}) => {
  const res = await API.post("/security/security-question", payload);
  return res.data;
};

// Set PIN
export const setUserPinService = async (payload: {
  pin: string;
}) => {
  const res = await API.post("/security/pin/setup", payload);
  return res.data;
};

// Get bank accounts
export const getUserBankAccountsService = async () => {
  const res = await API.get("/bank");

  return res.data as {
    status: string;
    message: string;
    data: BankAccount;
  };
};


// Change PIN
export const changePinService = async (payload: {
  oldPin: string;
  newPin: string;
}) => {
  const res = await API.post("/security/pin/change", payload);

  return res.data;
};

// ===== TRANSACTION SERVICES =====

// Get transactions with filters
export const getTransactionsService = async (params?: {
  page?: number;
  limit?: number;
  amount?: number;
  type?: string;
  intent?: string;
  gatewayType?: string;
  status?: string;
  reference?: string;
  planId?: string;
  fromDate?: string;
  toDate?: string;
}) => {
  const queryParams = new URLSearchParams();
  
  // Add all provided parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const url = `/transaction${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const res = await API.get(url);
  return res.data;
};

// Get single transaction by ID
export const getTransactionByIdService = async (id: string) => {
  const res = await API.get(`/transaction/${id}`);
  return res.data;
};

export const requestStatementReport = async (payload: {
  fromDate: string;
  toDate: string;
}) => {
  const res = await API.post("/transaction/report", payload);
  return res.data;
};

// ===== LIQUIDATION SERVICES =====

// Liquidate plan
export const liquidatePlanService = async (
  planId: string,
  payload: {
    amount: number;
    isFull: boolean;
  }
) => {
  const res = await API.post(`/plan/${planId}/liquidate`, payload);
  return res.data;
};

// Authorize intent
export const authorizeIntentService = async (
  intentId: string,
  payload: {
    method: "PIN";
    pin: string;
  }
) => {
  const res = await API.post(`/security/intents/${intentId}/authorize`, payload);
  return res.data;
};


// ===== NEXT OF KIN SERVICES =====

export interface NextOfKinData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  userId: string;
}

export interface NextOfKinResponse {
  status: string;
  message: string;
  data: NextOfKinData;
}

// GET saved next of kin details
export const getNextOfKin = async (): Promise<NextOfKinData | null> => {
  try {

    const response = await API.get<NextOfKinResponse>("/user/next-of-kin");
    

    
    if (response.data.status === "success") {
      return response.data.data;
    }
    
    return null;
  } catch (error: any) {
    // Handle 404 specifically (no next of kin saved yet)
    if (error.response?.status === 404) {

      return null;
    }
    
    // Handle 401 (token issues)
    if (error.response?.status === 401) {
      // Unauthorized - token may be invalid/expired
      throw new Error("Session expired. Please log in again.");
    }
    
    console.error("❌ Error fetching next of kin:", error);
    throw error;
  }
};

// SAVE/UPDATE next of kin details
export const saveNextOfKin = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
}): Promise<NextOfKinData> => {
  try {

    
    const response = await API.put<NextOfKinResponse>("/user/next-of-kin", data);
    

    
    if (response.data.status === "success") {
      return response.data.data;
    }
    
    throw new Error(response.data.message || "Failed to save next of kin");
  } catch (error: any) {
    console.error("❌ Error saving next of kin:", error);
    
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    
    throw new Error(error.response?.data?.message || "Failed to save next of kin details");
  }
};