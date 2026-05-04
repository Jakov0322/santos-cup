"use client";

import { create } from "zustand";
import { USER_ROLES } from "../constants/tournament";
import { SessionUser } from "@/app/types/auth";

type AuthStore = {
  user: SessionUser | null;

  loginAsAdmin: () => void;

  loginAsCaptain: () => void;

  logout: () => void;
};

export const useAuthStore =
  create<AuthStore>((set) => ({
    user: null,

    loginAsAdmin: () =>
      set({
        user: {
          id: "admin-1",
          name: "Admin Santos",
          role: USER_ROLES.ADMIN,
        },
      }),

    loginAsCaptain: () =>
      set({
        user: {
          id: "captain-1",
          name: "Luca Bianchi",
          role: USER_ROLES.CAPTAIN
        },
      }),

    logout: () =>
      set({
        user: null,
      }),
  }));