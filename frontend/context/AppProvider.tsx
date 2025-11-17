"use client";

import Loader from "@/components/Loader";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface AppProviderType {
  isLoading: boolean;
  authToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string,email: string,password: string,password_confirmation: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppProviderType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(
    Cookies.get("authToken") || null
  );
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      setAuthToken(token);
    }else{
        router.push("/auth");
    }
    setIsLoading(false);
  } )

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data.status) {

        Cookies.set("authToken", response.data.token, { expires: 7 });

        toast.success(response.data.message || "Login successful!");
        setAuthToken(response.data.token);

        router.push("/dashboard");
      } else {
        toast.error(response.data.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
      });

      if (response.data.status) {
        toast.success(response.data.message || "Registration successful!");
        // Optionally redirect to login after registration
        router.push("/auth");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    Cookies.remove("authToken");
    setIsLoading(false);
    toast.success("Logout successful!");
    router.push("/auth");
    return
  };

  return (
    <AppContext.Provider value={{ login, register, isLoading, authToken, logout }}>
      {isLoading ? <Loader /> : children}
    </AppContext.Provider>
  );
};

export const myAppHook = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("myAppHook must be used inside AppProvider");
  }
  return context;
};
