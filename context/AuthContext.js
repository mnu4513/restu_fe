import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { BackendAPI } from "@/utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // undefined = not checked yet
  // null = checked, no user
  // object = logged-in user
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const API = BackendAPI || ""; // "" means relative

  // ✅ Load user from localStorage on refresh
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        setUser(JSON.parse(raw));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth load error", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/api/auth/login`, {
      email,
      password,
    });

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  // ✅ Register function
  const register = async (name, email, number, password) => {
    const { data } = await axios.post(`${API}/api/auth/register`, {
      name,
      email,
      number,
      password,
    });

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");

    // optional: disconnect socket if you store one globally
    if (window.__APP_SOCKET__) {
      try {
        window.__APP_SOCKET__.disconnect();
      } catch {}
      window.__APP_SOCKET__ = null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
