"use server";

import { Ticket } from "@/app/lib/definitions";
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();
const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });

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

export async function attendTicket({
  ticketId,
  bankTellerId,
}: {
  ticketId: number;
  bankTellerId: number;
}): Promise<Ticket | null> {
  const [ticket] = await sql<Ticket[]>`
    UPDATE tickets
    SET status = 'serving', bank_teller_id = ${bankTellerId}, updated_at = NOW()
    WHERE id = ${ticketId}
    RETURNING *;
  `;
  return ticket ?? null;
}


export async function cancelTicket(ticketId: number): Promise<Ticket | null> {
  const [ticket] = await sql<Ticket[]>`
    UPDATE tickets
    SET status = 'waiting', bank_teller_id = NULL, updated_at = NOW()
    WHERE id = ${ticketId}
    RETURNING *;
  `;
  return ticket ?? null;
}