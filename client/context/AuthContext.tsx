import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  signup: (username: string, email: string, password: string) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const signup = (username: string, email: string, password: string) => {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (existingUsers.some((u: User) => u.username === username)) {
      return false;
    }

    const newUser = { username, email, password };
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    localStorage.setItem("currentUser", JSON.stringify({ username, email }));
    setUser({ username, email });
    return true;
  };

  const login = (username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (!foundUser) {
      return false;
    }

    const userData = { username: foundUser.username, email: foundUser.email };
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
