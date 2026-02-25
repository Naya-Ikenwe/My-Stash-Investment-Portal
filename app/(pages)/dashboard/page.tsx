// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { userProfile } from "@/app/api/Users";
import { getDashboardData } from "@/app/api/dashboard";
import PortfolioCards from "@/app/components/PortfolioCards";
import PortfolioGrowth from "@/app/components/PortfolioGrowth";
import RecentActivities from "@/app/components/RecentActivities";
import TransactionHistory from "@/app/components/TransactionHistory";
import { useAuthStore } from "@/app/store/authStore";

type User = {
  data: {
    id: string;
    firstName: string;
  };
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUser: setAuthUser } = useAuthStore();

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
        if (userData?.data) {
          setAuthUser(userData.data);
        }
        setDashboardData(dashboardResponse.data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [setAuthUser]);

  return (
    <main>
      <h2 className="text-3xl lg:text-4xl font-heading">
        Hello <span className="text-primary">{user?.data?.firstName},</span>
      </h2>

      <hr className="my-4 border border-[#455A6433]" />

      <section className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-4/5 flex flex-col gap-4">
          <PortfolioCards 
            dashboardData={dashboardData} 
            userId={user?.data?.id} // 👈 Only this line added
            isLoading={loading}
            error={error}
          />

          <div className="flex flex-col xl:flex-row gap-4">
            <div className="w-full xl:w-3/5">
              <PortfolioGrowth 
                dashboardData={dashboardData} 
                isLoading={loading}
              />
            </div>

            <div className="w-full xl:w-2/5">
              <TransactionHistory 
                dashboardData={dashboardData} 
                isLoading={loading}
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/5">
          <RecentActivities 
            dashboardData={dashboardData} 
            isLoading={loading}
          />
        </div>
      </section>
    </main>
  );
}