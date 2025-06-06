import { useState, ReactNode } from "react";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("oxfToken")
  );

  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("oxfusername")
  );

  const login = (token: string) => {
    setToken(token);
    localStorage.setItem("oxfToken", token);
  };

  const getUsername = (uname: string) => {
    setUsername(username);
    localStorage.setItem("oxfusername", uname);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("oxfToken");
    localStorage.removeItem("oxfusername");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, getUsername, username }}>
      {children}
    </AuthContext.Provider>
  );
};
