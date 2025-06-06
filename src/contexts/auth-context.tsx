import { createContext } from "react";

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (token: string) => void;
  getUsername: (uname: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
