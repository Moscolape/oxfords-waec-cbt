import { useState, ReactNode } from "react";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("oxfToken")
  );

  const [userrole, setUserrole] = useState<string | null>(
    sessionStorage.getItem("oxfuserrole")
  );

  const login = (token: string) => {
    setToken(token);
    localStorage.setItem("oxfToken", token);
  };

  const getUserrole = (uname: string) => {
    setUserrole(userrole);
    sessionStorage.setItem("oxfuserrole", uname);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("oxfToken");
    sessionStorage.removeItem("oxfuserrole");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, getUserrole, userrole }}>
      {children}
    </AuthContext.Provider>
  );
};
