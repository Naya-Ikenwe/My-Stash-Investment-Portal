import { UseFormReturn } from "react-hook-form";

export interface PlanFormData {
  name: string;
  principal: number;
  duration: number;
  startDate: number;
  endDate: number;
  payoutFrequency: "MONTHLY";
  payoutAccountId: string;
  rolloverType: "PRINCIPAL_ONLY";
}

export interface CreateFormPlanProps {
  onBack: () => void;
  onContinue: () => void;
  form: UseFormReturn<PlanFormData>;
}
