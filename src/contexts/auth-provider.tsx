import { useState, ReactNode } from "react";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("oxfToken")
  );

  const [userrole, setUserrole] = useState<string | null>(
    localStorage.getItem("oxfuserrole")
  );

  const login = (token: string) => {
    setToken(token);
    localStorage.setItem("oxfToken", token);
  };

  const getUserrole = (uname: string) => {
    setUserrole(userrole);
    localStorage.setItem("oxfuserrole", uname);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("oxfToken");
    localStorage.removeItem("oxfuserrole");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, getUserrole, userrole }}>
      {children}
    </AuthContext.Provider>
  );
};
