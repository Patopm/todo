"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "@/lib/api";

type User = { id: number; username: string; email: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (u: string, e: string, p: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Restore token from localStorage on mount
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      api.defaults.headers.Authorization = `Bearer ${savedToken}`;
    }
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await api.post("/auth/login/", { username, password });
    localStorage.setItem("token", data.access);
    api.defaults.headers.Authorization = `Bearer ${data.access}`;
    setUser({ id: -1, username, email: "" });
    setToken(data.access);
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    await api.post("/auth/", { username, email, password });
    return login(username, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    delete api.defaults.headers.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
