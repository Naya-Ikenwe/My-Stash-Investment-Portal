import { UseFormReturn } from "react-hook-form";


// Bank account type from your API
export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
export interface PlanFormData {
  name: string;
  principal: number;
  duration: number;
  startDate: number;
  endDate: number;
  // Add these new fields for rollover settings
  rollover: boolean;
  rolloverType: "PRINCIPAL_ONLY" | "PRINCIPAL_AND_INTEREST";
  payoutAccountId: string; // Should be string (matching bank.id)
}

export interface CreateFormPlanProps {
  onBack: () => void;
  onContinue: () => void;
  form: UseFormReturn<PlanFormData>;
}