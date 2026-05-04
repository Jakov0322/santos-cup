"use client";

import { usePersistEvents } from "@/app/lib/store/persist-events";

export function EventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  usePersistEvents();

  return <>{children}</>;
}