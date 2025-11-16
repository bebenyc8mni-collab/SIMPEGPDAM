
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../services/database';
import { User, Admin } from '../types';

interface AuthContextType {
  user: User | Admin | null;
  role: 'admin' | 'user' | null;
  login: (identifier: string, pass: string, r: 'admin' | 'user') => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | Admin | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);
  const { db } = useDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('simpeg_user');
      const storedRole = sessionStorage.getItem('simpeg_role');
      if (storedUser && storedRole) {
        setUser(JSON.parse(storedUser));
        setRole(storedRole as 'admin' | 'user');
      }
    } catch (error) {
      console.error("Failed to parse user data from session storage", error);
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (identifier: string, pass: string, r: 'admin' | 'user'): Promise<boolean> => {
    if (r === 'admin') {
      const admin = db.admins.find(a => a.username === identifier);
      // In a real app, passwords would be hashed
      if (admin && pass === 'admin123') { 
        setUser(admin);
        setRole('admin');
        sessionStorage.setItem('simpeg_user', JSON.stringify(admin));
        sessionStorage.setItem('simpeg_role', 'admin');
        navigate('/admin/dashboard');
        return true;
      }
    } else {
      const userAccount = db.users.find(u => u.email === identifier || u.employeeId === identifier);
      if (userAccount && pass === 'user123') { // Simple password check
        setUser(userAccount);
        setRole('user');
        sessionStorage.setItem('simpeg_user', JSON.stringify(userAccount));
        sessionStorage.setItem('simpeg_role', 'user');
        navigate('/user/dashboard');
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    sessionStorage.removeItem('simpeg_user');
    sessionStorage.removeItem('simpeg_role');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
