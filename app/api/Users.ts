import API from "@/lib/axiosInstance";

// Existing functions
export const signupService = async (payload: { email: string; password: string }) => {
  const res = await API.post("/user/signup", payload);
  return res.data;
};

export const loginService = async (payload: { email: string; password: string }) => {
  const res = await API.post("/user/login", payload);
  return res.data;
};

export const userProfile = async () => {
  const res = await API.get("/user/profile");
  return res.data;
};

export const verifyEmailService = async (payload: { email: string; token: string }) => {
  const res = await API.post("/user/verify-email", payload);
  return res.data;
};

export const verifyIdentity = async (payload: any) => {
  const res = await API.patch("/user/profile", payload);
  const kyc = await API.patch("/user/kyc", payload);
  return (res.data, kyc.data);
};

// ✅ NEW Forgot Password Functions
export const forgotPasswordService = async (payload: { email: string }) => {
  const res = await API.post("/user/forgot-password", payload);
  return res.data;
};

export const resetPasswordService = async (payload: {
  email: string;
  token: string;
  newPassword: string;
}) => {
  const res = await API.post("/user/reset-password", payload);
  return res.data;
};
