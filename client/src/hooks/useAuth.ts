import { selectCurrentUser } from "../features/auth/authSlice";
import { useMemo } from "react";
import { useAppSelector } from "./store";

export const useAuth = () => {
  const user = useAppSelector(selectCurrentUser);
  return useMemo(() => ({ user }), [user]);
};
