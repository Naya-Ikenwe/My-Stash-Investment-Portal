"use client";

import AuthWrapper from "@/app/components/auth/AuthWrapper";
import CreateFormPlan from "@/app/components/CreatePlanForm";
import CreatePlanWelcome from "@/app/components/CreatePlanWelcome";
import { useState } from "react";

export default function CreatePlanPage() {
  const [activeTab, setActiveTab] = useState("welcome");

  return (
    <AuthWrapper>
      {activeTab === "welcome" ? (
        <CreatePlanWelcome onContinue={() => setActiveTab("form")} />
      ) : (
        <CreateFormPlan onBack={() => setActiveTab("welcome")} />
      )}
    </AuthWrapper>
  );
}
