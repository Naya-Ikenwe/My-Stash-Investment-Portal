import API from "@/lib/axiosInstance";

export const signupService = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await API.post("/user/signup", payload);
  return res.data;
};

export const loginService = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await API.post("/user/login", payload);
  return res.data;
};

export const userProfile = async () => {
  const res = await API.get("/user/profile");
  return res.data;
};

export const verifyEmailService = async (payload: {
  email: string;
  token: string;
}) => {
  const res = await API.post("/user/verify-email", payload);
  return res.data;
};

export const verifyIdentity = async () => {
  const res = await API.post("/bank");
  return res.data;
};
