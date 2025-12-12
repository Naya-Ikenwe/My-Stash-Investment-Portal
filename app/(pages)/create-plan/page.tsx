"use client";

import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CreateFormPlan from "@/app/components/CreatePlanForm";
import CreatePlanWelcome from "@/app/components/CreatePlanWelcome";
import PlanBreakdown from "@/app/components/PlanBreakdown";
import { PlanFormData } from "@/app/types/plan";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreatePlanPage() {
  const [activeTab, setActiveTab] = useState("welcome");
  const form = useForm<PlanFormData>({
    defaultValues: {
      name: "",
      principal: 0,
      duration: 0,
      startDate: Date.now(),
      endDate: 0,
      roiRate: 0.15,
      roiType: "FIXED",
      payoutFrequency: "MONTHLY",
      payoutAccountId: "acc-123-456",
    },
  });

  return (
    <AuthWrapper>
      {activeTab === "welcome" && (
        <CreatePlanWelcome onContinue={() => setActiveTab("form")} />
      )}

      {activeTab === "form" && (
        <CreateFormPlan
          onContinue={() => setActiveTab("breakdown")}
          onBack={() => setActiveTab("welcome")}
          form={form}
        />
      )}

      {activeTab === "breakdown" && (
        <PlanBreakdown onBack={() => setActiveTab("form")} form={form} />
      )}
    </AuthWrapper>
  );
}
