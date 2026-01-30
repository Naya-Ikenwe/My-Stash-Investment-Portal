import { v4 as uuidv4 } from "uuid";
import API from "@/lib/axiosInstance";

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
  deviceName?: string; // ADD THIS
}) => {
  const res = await API.post("/user/signup", payload);
  return res.data;
};

// Login - updated with deviceName
export const loginService = async (payload: { 
  email: string; 
  password: string;
  deviceId: string;
  deviceName?: string; // ADD THIS
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

// Verify identity
export const verifyIdentity = async (payload: {
  deviceId: string;
  dateOfBirth: string;
  gender: string;
  bank: string;
  accountNumber: string;
  accountName: string;
  bvn: string;
  bvnName: string;
}) => {
  // Ensure deviceId exists
  if (!payload.deviceId) {
    payload.deviceId = uuidv4();
  }

  const profileRes = await API.patch("/user/profile", payload);
  const kycRes = await API.patch("/user/kyc", payload);

  return {
    profile: profileRes.data,
    kyc: kycRes.data,
  };
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

// Update user profile
export const updateProfileService = async (payload: any) => {
  const res = await API.patch("/user/profile", payload);
  return res.data;
};

// Logout (optional - if your backend has a logout endpoint)
export const logoutService = async () => {
  const res = await API.post("/user/logout");
  return res.data;
};