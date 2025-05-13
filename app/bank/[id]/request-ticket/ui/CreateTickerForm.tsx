"use client";

import { useState } from "react";
import { createTicket } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

export function CreateTicketForm({
  buttonColor,
  bankId,
}: {
  buttonColor: string;
  bankId: number;
}) {
  const [ticketNumber, setTicketNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreateTicket() {
    setLoading(true);
    const ticket = await createTicket(bankId);
    setTicketNumber(ticket.number);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={handleCreateTicket}
        disabled={loading}
        className="text-white text-lg md:text-2xl uppercase py-3 px-6 rounded-lg w-full transition hover:brightness-110"
        style={{ backgroundColor: buttonColor }}
      >
        {loading ? "Generando..." : "Solicitar turno"}
      </button>

      <div className="h-20 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
        {ticketNumber ? (
          <span className="text-3xl font-bold text-black">Turno #{ticketNumber}</span>
        ) : (
          <span className="text-gray-400 text-lg">Tu número aparecerá aquí</span>
        )}
      </div>

      {ticketNumber !== null && (
        <button
          onClick={() => router.push(`/bank/${bankId}/queue`)}
          className="text-white bg-gray-800 hover:bg-gray-700 text-lg py-2 px-4 rounded-lg transition"
        >
          Ver turnos
        </button>
      )}
    </div>
  );
}