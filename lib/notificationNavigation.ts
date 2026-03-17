import type { Notification } from "@/app/api/notification";

type NotificationMetadata = Notification["metadata"];

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

const getDirectRoute = (metadata: NotificationMetadata) =>
  getStringValue(metadata, ["route", "href", "url", "link"]);

const buildTextIndex = (notification: Notification) =>
  [notification.type, notification.title, notification.message]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const hasAnyKeyword = (value: string, keywords: string[]) =>
  keywords.some((keyword) => value.includes(keyword));

export const getNotificationDestination = (notification: Notification) => {
  const directRoute = getDirectRoute(notification.metadata);
  if (directRoute && directRoute.startsWith("/")) {
    return directRoute;
  }

  const planId = getPlanId(notification.metadata);
  const textIndex = buildTextIndex(notification);

  if (planId) {
    if (
      hasAnyKeyword(textIndex, [
        "transaction",
        "withdraw",
        "withdrawal",
        "top up",
        "topup",
        "transfer",
        "payout",
        "roi",
        "refund",
        "liquidat",
      ])
    ) {
      return `/dashboard/transaction-history?planId=${encodeURIComponent(planId)}`;
    }

    return `/dashboard/plans/${encodeURIComponent(planId)}`;
  }

  if (
    hasAnyKeyword(textIndex, [
      "plan",
      "rollover",
      "maturity",
      "matured",
      "investment",
      "principal",
    ])
  ) {
    return "/dashboard/plans";
  }

  if (
    hasAnyKeyword(textIndex, [
      "transaction",
      "withdraw",
      "withdrawal",
      "top up",
      "topup",
      "transfer",
      "payout",
      "roi",
      "refund",
      "statement",
      "payment",
      "liquidat",
    ])
  ) {
    return "/dashboard/transaction-history";
  }

  if (hasAnyKeyword(textIndex, ["embassy", "letter request"])) {
    return "/dashboard/embassy";
  }

  if (
    hasAnyKeyword(textIndex, [
      "profile",
      "kyc",
      "identity",
      "authorization",
      "next of kin",
      "password",
      "account",
      "personal details",
    ])
  ) {
    return "/dashboard/profile";
  }

  return "/notifications";
};