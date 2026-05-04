"use client";

import { usePersistAuth } from "@/app/lib/store/persist-auth";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  usePersistAuth();

  return <>{children}</>;
}