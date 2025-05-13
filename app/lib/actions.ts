"use server";

import { Ticket } from "@/app/lib/definitions";
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();
const sql = postgres(
  process.env.POSTGRES_URL!, { ssl: false });


export async function createTicket(bankId: number): Promise<Ticket> {
  const [result] = await sql<Ticket[]>`
    INSERT INTO tickets (number, status, bank_id)
    VALUES (
      (SELECT COALESCE(MAX(number), 0) + 1 FROM tickets WHERE bank_id = ${bankId}),
      'waiting',
      ${bankId}
    )
    RETURNING *;
  `;
  return result;
}



export async function serveNextTicket(): Promise<Ticket | null> {
    const [ticket] = await sql<Ticket[]>`
      UPDATE tickets
      SET status = 'serving', updated_at = NOW()
      WHERE id = (
        SELECT id FROM tickets
        WHERE status = 'waiting'
        ORDER BY number ASC
        LIMIT 1
      )
      RETURNING *;
    `;
    return ticket ?? null;
}