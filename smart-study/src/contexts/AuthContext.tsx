import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  email: string;
  full_name?: string;
  role?: string; // ✅ added for admin detection
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ token?: string; user?: User; error?: string }>;
  register: (
    email: string,
    password: string,
    data?: { full_name?: string }
  ) => Promise<{ message?: string; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [token, user]);

  // ✅ LOGIN
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
        setUser({
          email: data.user.email,
          full_name: data.user.name || data.user.full_name,
          role: data.user.role || "user",
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        return { token: data.token, user: data.user };
      } else {
        return { error: data.message || "Login failed" };
      }
    } catch (err: any) {
      return { error: err.message || "Login failed" };
    }
  };

  // ✅ REGISTER
  const register = async (
    email: string,
    password: string,
    data?: { full_name?: string }
  ) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: data?.full_name }),
      });

      const resData = await res.json();

      if (res.ok)
        return { message: resData.message || "Registration successful" };
      else return { error: resData.message || "Registration failed" };
    } catch (err: any) {
      return { error: err.message || "Registration failed" };
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

