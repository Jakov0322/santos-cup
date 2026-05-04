"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/app/lib/store/auth-store";

import { UserRole } from "@/app/lib/constants/types";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
};

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const user = useAuthStore(
    (state) => state.user
  );

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (
      !allowedRoles.includes(user.role)
    ) {
      window.location.href = "/";
    }
  }, [user, allowedRoles]);

  if (!user) return null;

  if (
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}