import { UserRole } from "../lib/constants/types";

export type SessionUser = {
  id: string;
  name: string;
  role: UserRole;
};