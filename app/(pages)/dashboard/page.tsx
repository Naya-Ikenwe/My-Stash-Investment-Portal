"use client";

import { getAllPlans } from "@/app/api/Plan";
import { userProfile } from "@/app/api/Users";
import PortfolioCards from "@/app/components/PortfolioCards";
import PortfolioGrowth from "@/app/components/PortfolioGrowth";
import RecentActivities from "@/app/components/RecentActivities";
import TransactionHistory from "@/app/components/TransactionHistory";
import { useEffect, useState } from "react";

type User = {
  data: {
    firstName: string;
  };
};
export default function Dashboard() {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userProfile();
        // const plans = await getPlans()
        // console.log("my plans: ", plans)
        setUser(data);
        console.log("Profile data:", data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <main>
      <h2 className="text-3xl font-heading">
        Hello <span className="text-primary">{user?.data?.firstName},</span>
      </h2>

      <hr className="my-4 border border-[#455A6433]" />

      <section className="flex gap-4">
        <div className="w-4/5 flex flex-col gap-4">
          <PortfolioCards />

          <div className="flex gap-4">
            <div className="w-3/5">
              <PortfolioGrowth />
            </div>

            <div className="w-2/5">
              <TransactionHistory />
            </div>
          </div>
        </div>

        <RecentActivities />
      </section>
    </main>
  );
}
