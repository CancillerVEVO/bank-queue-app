"use server";
import dotenv from "dotenv";
import { Employee, Ticket } from "@/app/lib/definitions";
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