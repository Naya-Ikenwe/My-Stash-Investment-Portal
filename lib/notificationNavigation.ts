import {
  NotificationType,
  type Notification,
  type NotificationMetadata,
} from "@/app/api/notification";

const getStringValue = (metadata: NotificationMetadata, keys: string[]) => {
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
};

const getPlanId = (metadata: NotificationMetadata) =>
  getStringValue(metadata, ["planId", "plan_id", "entityId", "entity_id"]);

const getRolloverPlanId = (metadata: NotificationMetadata) =>
  getStringValue(metadata, ["newPlanId", "planId", "plan_id", "entityId", "entity_id"]);

const getDirectRoute = (metadata: NotificationMetadata) =>
  getStringValue(metadata, ["route", "href", "url", "link"]);

export const getNotificationDestination = (notification: Notification) => {
  const directRoute = getDirectRoute(notification.metadata);
  if (directRoute && directRoute.startsWith("/")) {
    return directRoute;
  }

  const planId = getPlanId(notification.metadata);
  const rolloverPlanId = getRolloverPlanId(notification.metadata);

  switch (notification.type) {
    case NotificationType.PLAN_CREATED:
    case NotificationType.PLAN_ACTIVATED:
    case NotificationType.PLAN_MATURED:
    case NotificationType.PLAN_CLOSED:
      if (planId) {
        return `/dashboard/plans/${encodeURIComponent(planId)}`;
      }
      return "/dashboard/plans";

    case NotificationType.ROI_PAID:
    case NotificationType.PLAN_LIQUIDATED:
    case NotificationType.PLAN_TOP_UP_COMPLETED:
    case NotificationType.PLAN_WITHDRAWAL_COMPLETED:
      if (planId) {
        return `/dashboard/transaction-history?planId=${encodeURIComponent(planId)}`;
      }
      return "/dashboard/transaction-history";

    case NotificationType.PLAN_ROLLOVER_COMPLETED:
      if (rolloverPlanId) {
        return `/dashboard/plans/${encodeURIComponent(rolloverPlanId)}`;
      }
      return "/dashboard/plans";

    case NotificationType.TRANSACTION_REPORT_READY:
      return "/dashboard/transaction-history";

    case NotificationType.USER_PASSWORD_RESET:
    case NotificationType.ADMIN_PASSWORD_RESET:
    case NotificationType.USER_PASSWORD_CHANGED:
    case NotificationType.ADMIN_PASSWORD_CHANGED:
    case NotificationType.USER_CREATED:
    case NotificationType.ADMIN_CREATED:
      return "/dashboard/profile";

    default:
      return "/notifications";
  }
};