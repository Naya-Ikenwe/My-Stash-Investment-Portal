// app/components/RecentActivities.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Notification,
  getRecentNotifications,
  markNotificationAsRead,
} from "@/app/api/notification";
import { getNotificationDestination } from "@/lib/notificationNavigation";

type RecentActivitiesProps = {
  dashboardData?: unknown;
  isLoading?: boolean;
};

export default function RecentActivities({ 
  isLoading = false 
}: RecentActivitiesProps) {
  const router = useRouter();
  const [activities, setActivities] = useState<Notification[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // Format time to "X hours/days ago"
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Fetch activities on component mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoadingActivities(true);
        

        const notifications = await getRecentNotifications(5);
        
        // Filter to only show unread notifications or limit to 3
        const recentActivities = notifications.slice(0, 3);
        setActivities(recentActivities);
        
      } catch (err) {
        console.error("❌ Error fetching activities:", err);
        setActivities([]);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    if (!isLoading) {
      fetchActivities();
    }
  }, [isLoading]);

  // Combined loading state
  const isActuallyLoading = isLoading || isLoadingActivities;

  const handleActivityClick = async (activity: Notification) => {
    if (!activity.isRead) {
      try {
        const success = await markNotificationAsRead(activity.id);

        if (success) {
          setActivities((prev) =>
            prev.map((notification) =>
              notification.id === activity.id
                ? { ...notification, isRead: true }
                : notification,
            ),
          );
        }
      } catch (error) {
        console.error("Failed to mark activity as read:", error);
      }
    }

    router.push(getNotificationDestination(activity));
  };

  if (isActuallyLoading) {
    return (
      <main className="w-full bg-[#F7F7F7] p-4 rounded-2xl flex flex-col">
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
    <main className="w-full bg-[#F7F7F7] p-4 rounded-2xl flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold">Recent Activities</p>
        
        {/* Show unread count only if there ARE unread activities */}
        {activities.filter(a => !a.isRead).length > 0 && (
          <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
            {activities.filter(a => !a.isRead).length} new
          </span>
        )}
      </div>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-gray-300 text-2xl mb-2">📭</div>
            <p className="text-sm text-gray-600">No recent activities</p>
            <p className="text-xs text-gray-500 mt-1">Activities will appear here</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer ${
                !activity.isRead ? 'bg-white' : ''
              }`}
              role="button"
              tabIndex={0}
              onClick={() => handleActivityClick(activity)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  void handleActivityClick(activity);
                }
              }}
            >
              {/* SIMPLE PURPLE DOT */}
              <div className="shrink-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  !activity.isRead ? 'bg-[#A243DC]' : 'bg-gray-300'
                }`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className={`font-medium text-sm truncate ${
                    !activity.isRead ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {activity.title}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{activity.message}</p>
                
                {/* Optional: Show amount if available in metadata */}
                {activity.metadata?.amount && (
                  <div className="mt-1">
                    <span className={`text-xs font-medium ${
                      activity.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {activity.type === 'withdrawal' ? '-' : '+'}₦
                      {Number(activity.metadata.amount).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All link that goes to notifications page - ALWAYS SHOW */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link 
          href="/notifications" 
          className="text-xs text-primary hover:underline w-full text-center block"
        >
          View all activities →
        </Link>
      </div>
    </main>
  );
}