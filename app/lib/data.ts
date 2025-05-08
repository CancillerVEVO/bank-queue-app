"use server";
import dotenv from "dotenv";
import { Employee, Ticket, BankTeller, Bank, EmployeeContext } from "@/app/lib/definitions";
import postgres from "postgres";
dotenv.config();


const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });
export async function getQueue(): Promise<Ticket[]> {
  return await sql<Ticket[]>`
      SELECT * FROM tickets
      WHERE status = 'waiting'
      ORDER BY number ASC;
    `;
}

export async function getEmployee(email: string): Promise<Employee | null> {
  const [employee] = await sql<Employee[]>`
      SELECT * FROM employees
      WHERE email = ${email};
    `;
  return employee ?? null;
}

export async function getEmployeeContext(employee_id: number): Promise<EmployeeContext | null> {
  const [employee] = await sql<EmployeeContext[]>`
    SELECT 
      e.id AS employee_id,
      e.email,
      bt.id AS bank_teller_id,
      bt.window_number,
      b.id AS bank_id,
      b.name AS bank_name,
      b.image_url,
      b.background_color,
      b.button_color
    FROM employees e
    JOIN bank_tellers bt ON bt.employee_id = e.id
    JOIN banks b ON b.id = bt.bank_id
    WHERE e.id = ${employee_id};
  `;


  return employee ?? null;

}

export async function getBank(bankId: number): Promise<Bank | null> {
  const [bank] = await sql<Bank[]>`
      SELECT * FROM banks
      WHERE id = ${bankId};
    `;
  return bank ?? null;
}