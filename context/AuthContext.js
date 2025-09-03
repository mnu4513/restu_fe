import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { BackendAPI } from "@/utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const API = BackendAPI || "";  // "" means relative

  // ✅ Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    const { data } = await axios.post(
      `${API}/api/auth/login`,
      { email, password }
    );

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  // ✅ Register function
  const register = async (name, email, password) => {
    const { data } = await axios.post(
      `${API}/api/auth/register`,
      { name, email, password }
    );

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
