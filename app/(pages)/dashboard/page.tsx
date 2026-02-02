// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { userProfile } from "@/app/api/Users";
import { getDashboardData } from "@/app/api/dashboard";
import PortfolioCards from "@/app/components/PortfolioCards";
import PortfolioGrowth from "@/app/components/PortfolioGrowth";
import RecentActivities from "@/app/components/RecentActivities";
import TransactionHistory from "@/app/components/TransactionHistory";

type User = {
  data: {
    firstName: string;
  };
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [userData, dashboardResponse] = await Promise.all([
          userProfile(),
          getDashboardData()
        ]);
        
        setUser(userData);
        setDashboardData(dashboardResponse.data);
      } catch (err: any) {
        console.error("Error fetching dashboard:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <main>
      <h2 className="text-3xl font-heading">
        Hello <span className="text-primary">{user?.data?.firstName},</span>
      </h2>

      <hr className="my-4 border border-[#455A6433]" />

      <section className="flex gap-4">
        <div className="w-4/5 flex flex-col gap-4">
          <PortfolioCards 
            dashboardData={dashboardData} 
            isLoading={loading}
            error={error}
          />

          <div className="flex gap-4">
            <div className="w-3/5">
              <PortfolioGrowth 
                dashboardData={dashboardData} 
                isLoading={loading}
              />
            </div>

            <div className="w-2/5">
              <TransactionHistory 
                dashboardData={dashboardData} 
                isLoading={loading}
              />
            </div>
          </div>
        </div>

        <RecentActivities 
          dashboardData={dashboardData} 
          isLoading={loading}
        />
      </section>
    </main>
  );
}