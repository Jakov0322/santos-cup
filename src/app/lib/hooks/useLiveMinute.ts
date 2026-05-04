"use client";

import { useEffect, useState } from "react";

export function useLiveMinute(
  initialMinute = 1
) {
  const [minute, setMinute] =
    useState(initialMinute);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinute((prev) => prev + 1);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return minute;
}