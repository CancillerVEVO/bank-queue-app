"use server";
import dotenv from "dotenv";
import {
  Employee,
  Ticket,
  BankTeller,
  Bank,
  EmployeeContext,
  TellerTicketInfo,
} from "@/app/lib/definitions";
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

export async function getQueueByBank(bankId: number): Promise<Ticket[]> {
  return await sql<Ticket[]>`
      SELECT * FROM tickets
      WHERE status = 'waiting' AND bank_id = ${bankId}
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

export async function getEmployeeContext(
  employee_id: number
): Promise<EmployeeContext | null> {
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

export async function getTellersTicketInfoByBank(
  bankId: number
): Promise<TellerTicketInfo[]> {
  const rows = await sql<TellerTicketInfo[]>`
    SELECT
      bt.id AS bank_teller_id,
      bt.window_number,
      e.id AS employee_id,
      e.email,
      b.id AS bank_id,
      b.name AS bank_name,
      b.image_url,
      b.background_color,
      b.button_color,

      t_current.id AS current_ticket_id,
      t_current.number AS current_ticket_number,
      t_current.status AS current_ticket_status,
      t_current.created_at AS current_ticket_created_at,

      t_next.id AS next_ticket_id,
      t_next.number AS next_ticket_number,
      t_next.status AS next_ticket_status,
      t_next.created_at AS next_ticket_created_at

    FROM bank_tellers bt
    JOIN employees e ON e.id = bt.employee_id
    JOIN banks b ON b.id = bt.bank_id

    LEFT JOIN tickets t_current ON t_current.bank_teller_id = bt.id AND t_current.status = 'serving'

    LEFT JOIN LATERAL (
      SELECT *
      FROM tickets
      WHERE status = 'waiting' AND bank_id = bt.bank_id
      ORDER BY created_at ASC
      LIMIT 1
    ) t_next ON true

    WHERE bt.bank_id = ${bankId};
  `;

  return rows;
}

export async function getTicketsByEmployeeId(
  employeeId: number
): Promise<Ticket[]> {
  const rows = await sql<Ticket[]>`
    SELECT tickets.*
    FROM tickets
    LEFT JOIN bank_tellers ON tickets.bank_teller_id = bank_tellers.id
    WHERE bank_tellers.employee_id = ${employeeId}
       OR tickets.bank_teller_id IS NULL
    ORDER BY tickets.created_at ASC;
  `;

  return rows;
}
export async function getTicketsForTeller(
  bankId: number,
  bankTellerId: number
): Promise<Ticket[]> {
  const rows = await sql<Ticket[]>`
    SELECT * FROM tickets
    WHERE bank_id = ${bankId}
      AND status <> 'served'
      AND (bank_teller_id IS NULL OR bank_teller_id = ${bankTellerId})
    ORDER BY created_at ASC;
  `;

  return rows;
}