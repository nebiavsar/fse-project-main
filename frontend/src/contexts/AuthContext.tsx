import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  customerId: string | null;
  customerName: string | null;
  login: (customerId: string, customerName: string, isAdmin?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem('isLoggedIn') === 'true');
  const [isAdmin, setIsAdmin] = useState<boolean>(localStorage.getItem('isAdmin') === 'true');
  const [customerId, setCustomerId] = useState<string | null>(localStorage.getItem('customerId'));
  const [customerName, setCustomerName] = useState<string | null>(localStorage.getItem('customerName'));

  const login = (customerId: string, customerName: string, isAdmin: boolean = false) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('customerId', customerId);
    localStorage.setItem('customerName', customerName);
    if (isAdmin) {
      localStorage.setItem('isAdmin', 'true');
    }
    setIsLoggedIn(true);
    setCustomerId(customerId);
    setCustomerName(customerName);
    setIsAdmin(isAdmin);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCustomerId(null);
    setCustomerName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, customerId, customerName, login, logout }}>
      {children}
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