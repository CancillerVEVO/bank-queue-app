'use client';

import { useEmployeeContext } from "@/app/contexts/EmployeeContext";

export default function DashboardPage() {
  const { email, bank_name, window_number } = useEmployeeContext();

  return (
    <div>
      <h1>Hola, {email}</h1>
      <p>Trabajas en el banco: {bank_name}</p>
      <p>Tu ventanilla es: {window_number}</p>
    </div>
  );
}
