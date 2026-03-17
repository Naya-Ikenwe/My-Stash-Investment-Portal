// app/api/notification.ts
import API from "@/lib/axiosInstance";

export enum NotificationType {
  PLAN_CREATED = "PLAN_CREATED",
  PLAN_ACTIVATED = "PLAN_ACTIVATED",
  ROI_PAID = "ROI_PAID",
  PLAN_MATURED = "PLAN_MATURED",
  PLAN_LIQUIDATED = "PLAN_LIQUIDATED",
  PLAN_TOP_UP_COMPLETED = "PLAN_TOP_UP_COMPLETED",
  PLAN_WITHDRAWAL_COMPLETED = "PLAN_WITHDRAWAL_COMPLETED",
  PLAN_CLOSED = "PLAN_CLOSED",
  PLAN_ROLLOVER_COMPLETED = "PLAN_ROLLOVER_COMPLETED",
  ADMIN_CREATED = "ADMIN_CREATED",
  USER_CREATED = "USER_CREATED",
  USER_PASSWORD_RESET = "USER_PASSWORD_RESET",
  ADMIN_PASSWORD_RESET = "ADMIN_PASSWORD_RESET",
  USER_PASSWORD_CHANGED = "USER_PASSWORD_CHANGED",
  ADMIN_PASSWORD_CHANGED = "ADMIN_PASSWORD_CHANGED",
  TRANSACTION_REPORT_READY = "TRANSACTION_REPORT_READY",
}

export type NotificationMetadata = {
  planId?: string;
  oldPlanId?: string;
  newPlanId?: string;
  route?: string;
  href?: string;
  url?: string;
  link?: string;
  amount?: number | string;
  entityId?: string;
  entity_id?: string;
  plan_id?: string;
  [key: string]: unknown;
};

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: NotificationMetadata;
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

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null) {
    const maybeAxiosError = error as {
      response?: { data?: unknown };
      message?: string;
    };

    return maybeAxiosError.response?.data ?? maybeAxiosError.message ?? "Unknown error";
  }

  return "Unknown error";
};

// 1. Get recent notifications
export const getRecentNotifications = async (limit: number = 5): Promise<Notification[]> => {
  try {

    const response = await API.get<NotificationsResponse>("/notification", {
      params: { page: 1, limit }
    });
    

    return response.data.data.results;
    
  } catch {
    return [];
  }
};

// 2. Get notification summary
export const getNotificationSummary = async (): Promise<NotificationSummary> => {
  try {

    const response = await API.get<NotificationSummaryResponse>("/notification/summary");
    

    return response.data.data;
    
  } catch {
    return { total: 0, read: 0, unread: 0 };
  }
};

// 3. Mark single notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {

    
    await API.post(`/notification/${notificationId}/read`);
    

    return true;
    
  } catch (error) {
    console.error("❌ Failed to mark as read:", getErrorMessage(error));
    return false;
  }
};

// 4. Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {

    
    await API.post("/notification/read-all");
    

    return true;
    
  } catch (error) {
    console.error("❌ Failed to mark all as read:", getErrorMessage(error));
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
    const params: Record<string, string | number | boolean> = { page, limit };
    if (isRead !== undefined) params.isRead = isRead;
    

    const response = await API.get<NotificationsResponse>("/notification", { params });
    
    return {
      notifications: response.data.data.results,
      totalCount: response.data.data.totalCount
    };
    
  } catch {

    return { notifications: [], totalCount: 0 };
  }
};