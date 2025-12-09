"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import type { User, UserRole } from "./types";
import { mockUsers } from "./mock-data";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  cv?: File | null;
  certificate?: File | null;
  field?: string;
  bio?: string;
  ratePerMin?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("dialexperts_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
      role?: UserRole
    ): Promise<boolean> => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          // localStorage.setItem("dialexperts_user", JSON.stringify(data.user));
          setIsLoading(false);
          return true;
        }
      } catch (error) {
        console.error("Login error:", error);
      }

      setIsLoading(false);
      return false;
    },
    []
  );

  const signup = useCallback(async (payload: SignupData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          payload
          //   {
          //   name: data.name,
          //   email: data.email,
          //   password: data.password,
          //   role: data.role,
          //   ...(data.role === "expert" && {
          //     field: data.field,
          //     bio: data.bio,
          //     ratePerMin: data.ratePerMin,
          //   }),
          // }
        ),
      });

      if (response.ok) {
        const responseData = await response.json();
        setUser(responseData.user);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Signup error:", error);
    }

    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("dialexperts_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
