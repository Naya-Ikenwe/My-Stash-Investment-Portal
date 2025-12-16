import API from "@/lib/axiosInstance";
import { PlanFormData } from "../types/plan";

export const createPlan = async (payload: PlanFormData) => {
  const res = await API.post("/plan", payload);
  return res.data;
};

export const getPlans = async () => {
  const res = await API.get("/plan");
  return res.data;
};
