"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
} from "react";
import type { User } from "./types";
import { useRouter } from "next/navigation"; // Assuming useRouter is from next/navigation
import { useWallet } from "@solana/wallet-adapter-react"; // Assuming useWallet is from solana wallet adapter

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { disconnect, autoConnect } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // Fetch user from token on mount
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  const logout = useCallback(async () => {
    try {
      await disconnect();
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push(window.origin ? window.origin : "/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [disconnect, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        setUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
