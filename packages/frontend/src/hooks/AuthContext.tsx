import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
login: (
  accessToken: string,
  user: User,
  refreshToken?: string,
  googleAccessToken?: string,
  googleRefreshToken?: string
) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  function parseJwt(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        name: payload.name,
      };
    } catch {
      return null;
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      const parsedUser = parseJwt(token);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);
  const login = (
    token: string,
    user: User,
    refreshToken?: string,
    googleAccessToken?: string,
    googleRefreshToken?: string
  ) => {
    setAccessToken(token);
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (googleAccessToken) localStorage.setItem('googleAccessToken', googleAccessToken);
    if (googleRefreshToken) localStorage.setItem('googleRefreshToken', googleRefreshToken);
  };
  const logout = () => {
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('googleAccessToken');
    localStorage.removeItem('googleRefreshToken');
    window.location.href = '/login';
  };
  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
