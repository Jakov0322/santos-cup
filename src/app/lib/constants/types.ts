import {
  MATCH_STATUSES,
  PACKAGE_TYPES,
  PAYMENT_STATUSES,
  USER_ROLES,
} from "./tournament";

export type MatchStatus =
  (typeof MATCH_STATUSES)[keyof typeof MATCH_STATUSES];

export type PaymentStatus =
  (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

export type PackageType =
  (typeof PACKAGE_TYPES)[keyof typeof PACKAGE_TYPES];

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];