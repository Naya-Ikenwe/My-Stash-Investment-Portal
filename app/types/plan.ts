import { UseFormReturn } from "react-hook-form";

export interface PlanFormData {
  name: string;
  principal: number;
  duration: number;
  startDate: number;
  endDate: number;
  roiRate: number;
  roiType: "FIXED";
  payoutFrequency: "MONTHLY";
  payoutAccountId: "acc-123-456";
}

export interface CreateFormPlanProps {
  onBack: () => void;
  onContinue: () => void;
  form: UseFormReturn<PlanFormData>;
}
