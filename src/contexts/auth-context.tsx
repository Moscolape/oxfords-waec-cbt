import { createContext } from "react";

interface AuthContextType {
  token: string | null;
  userrole: string | null;
  login: (token: string) => void;
  setUserRole: (uname: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
