// app/context/EmployeeContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type EmployeeContext } from '../lib/definitions';


const EmployeeContext = createContext<EmployeeContext | null>(null);

export function useEmployeeContext() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployeeContext must be used within a EmployeeProvider');
  }
  return context;
}

export function EmployeeProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: EmployeeContextType;
}) {
  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}
