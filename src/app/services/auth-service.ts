import { useAuthStore } from "../lib/store/auth-store";

export const authService = {
  getUser() {
    return useAuthStore.getState().user;
  },

  loginAsAdmin() {
    useAuthStore
      .getState()
      .loginAsAdmin();
  },

  loginAsCaptain() {
    useAuthStore
      .getState()
      .loginAsCaptain();
  },

  logout() {
    useAuthStore.getState().logout();
  },
};