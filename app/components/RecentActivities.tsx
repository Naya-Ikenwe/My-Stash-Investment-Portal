// app/components/RecentActivities.tsx
import { DashboardResponse } from "@/app/api/dashboard";

type RecentActivitiesProps = {
  dashboardData: DashboardResponse['data'] | null;
  isLoading?: boolean;
};

export default function RecentActivities({ 
  dashboardData, 
  isLoading = false 
}: RecentActivitiesProps) {
  
  // Mock activities with purple dots
  const activities = [
    {
      id: 1,
      title: "New Investment",
      description: "Created Premium Savings Plan",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "ROI Received",
      description: "₦12,500 ROI credited to your wallet",
      time: "1 day ago"
    },
    {
      id: 3,
      title: "Deposit Successful",
      description: "₦100,000 deposited from Bank Transfer",
      time: "2 days ago"
    },
  ];

  if (isLoading) {
    return (
      <main className="w-1/5 bg-[#F7F7F7] p-4 rounded-2xl flex flex-col">
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="w-1/5 bg-[#F7F7F7] p-4 rounded-2xl flex flex-col">
      <p className="font-semibold mb-4">Recent Activities</p>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            {/* Purple Dot */}
            <div className="w-2 h-2 bg-[#A243DC] rounded-full mt-2 flex-shrink-0"></div>
            
            <div className="flex-1">
              <p className="font-medium text-sm">{activity.title}</p>
              <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}