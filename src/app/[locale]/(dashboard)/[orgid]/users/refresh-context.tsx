"use client";

import { createContext, useContext } from "react";

const RefreshContext = createContext<(() => void) | null>(null);

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefresh must be used within a RefreshProvider");
  }
  return context;
};

// Wrapper component to pass the refresh function
export const RefreshProvider = ({ 
  children, 
  onRefresh 
}: { 
  children: React.ReactNode; 
  onRefresh: () => void; 
}) => {
  return (
    <RefreshContext.Provider value={onRefresh}>
      {children}
    </RefreshContext.Provider>
  );
};