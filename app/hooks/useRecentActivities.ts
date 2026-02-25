// app/hooks/useRecentActivities.ts
import { useState, useEffect } from 'react';
import { getRecentNotifications, Notification } from '@/app/api/notification';

export const useRecentActivities = (limit: number = 5) => {
  const [activities, setActivities] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const notifications = await getRecentNotifications(limit);
        setActivities(notifications);
        
      } catch (err: any) {
        setError(err.message || "Failed to load recent activities");
        setActivities([]); // Ensure empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
    
    // Optional: Set up polling/refreshing
    const intervalId = setInterval(fetchActivities, 60000); // Refresh every 60 seconds
    
    return () => clearInterval(intervalId);
  }, [limit]);

  return { activities, isLoading, error, refresh: () => {
    // Manual refresh function
    setIsLoading(true);
    getRecentNotifications(limit)
      .then(setActivities)
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }};
};