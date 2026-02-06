// app/api/notification.ts
import API from "@/lib/axiosInstance";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  message: string;
  status: string;
  data: {
    limit: number;
    page: number;
    totalCount: number;
    results: Notification[];
  };
}

export interface NotificationSummary {
  total: number;
  read: number;
  unread: number;
}

export interface NotificationSummaryResponse {
  message: string;
  status: string;
  data: NotificationSummary;
}

// 1. Get recent notifications
export const getRecentNotifications = async (limit: number = 5): Promise<Notification[]> => {
  try {
    console.log(`📨 Fetching ${limit} notifications...`);
    const response = await API.get<NotificationsResponse>("/notification", {
      params: { page: 1, limit }
    });
    
    console.log(`✅ Got ${response.data.data.results.length} notifications`);
    return response.data.data.results;
    
  } catch (error: any) {
    console.error("❌ Failed to fetch notifications:", error.response?.data || error.message);
    return [];
  }
};

// 2. Get notification summary
export const getNotificationSummary = async (): Promise<NotificationSummary> => {
  try {
    console.log("📊 Fetching notification summary...");
    const response = await API.get<NotificationSummaryResponse>("/notification/summary");
    
    console.log("📊 Summary:", response.data.data);
    return response.data.data;
    
  } catch (error: any) {
    console.error("❌ Failed to fetch summary:", error.response?.data || error.message);
    return { total: 0, read: 0, unread: 0 };
  }
};

// 3. Mark single notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    console.log(`👁️ Marking notification ${notificationId} as read...`);
    
    await API.post(`/notification/${notificationId}/read`);
    
    console.log(`✅ Notification ${notificationId} marked as read`);
    return true;
    
  } catch (error: any) {
    console.error("❌ Failed to mark as read:", error.response?.data || error.message);
    return false;
  }
};

// 4. Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    console.log("👁️ Marking ALL notifications as read...");
    
    await API.post("/notification/read-all");
    
    console.log("✅ All notifications marked as read");
    return true;
    
  } catch (error: any) {
    console.error("❌ Failed to mark all as read:", error.response?.data || error.message);
    return false;
  }
};

// 5. Get all notifications with pagination
export const getAllNotifications = async (
  page: number = 1, 
  limit: number = 20,
  isRead?: boolean
): Promise<{ notifications: Notification[]; totalCount: number }> => {
  try {
    const params: any = { page, limit };
    if (isRead !== undefined) params.isRead = isRead;
    
    console.log(`📄 Fetching page ${page}, limit ${limit}...`);
    const response = await API.get<NotificationsResponse>("/notification", { params });
    
    return {
      notifications: response.data.data.results,
      totalCount: response.data.data.totalCount
    };
    
  } catch (error: any) {
    console.error("❌ Failed to fetch all notifications:", error.response?.data || error.message);
    return { notifications: [], totalCount: 0 };
  }
};