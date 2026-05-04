export const MATCH_STATUSES = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
} as const;

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  RECEIPT_UPLOADED: "receipt_uploaded",
  CONFIRMED: "confirmed",
  REJECTED: "rejected",
} as const;

export const PACKAGE_TYPES = {
  BASIC: "basic",
  FULL: "full",
  PREMIUM: "premium",
} as const;

export const USER_ROLES = {
  PUBLIC: "public",
  CAPTAIN: "captain",
  ADMIN: "admin",
} as const;