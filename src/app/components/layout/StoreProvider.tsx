"use client";

import { usePersistStore } from "@/app/lib/store/persist-store";

export function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  usePersistStore();

  return <>{children}</>;
}