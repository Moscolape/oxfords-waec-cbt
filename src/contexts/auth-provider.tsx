import { useState, ReactNode } from "react";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("dipfToken")
  );

  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  const login = (token: string) => {
    setToken(token);
    localStorage.setItem("dipfToken", token);
  };

  const getUsername = (uname: string) => {
    setUsername(username);
    localStorage.setItem("username", uname);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("dipfToken");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, getUsername, username }}>
      {children}
    </AuthContext.Provider>
  );
};
