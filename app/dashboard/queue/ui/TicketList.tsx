"use client";
import { useState, useEffect } from "react";
import {
  Events,
  RequestVisibleTicketsResponse,
  TicketCreatedPayload,
} from "@/app/lib/socket-events";

import { useSocket } from "@/app/contexts/SocketContext";
import { Ticket } from "@/app/lib/definitions";

type Props = {
  bankId: number;
  bankTellerId: number;
};

export default function TicketList({ bankId, bankTellerId }: Props) {
  const socket = useSocket();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit(
      Events.Client.RequestVisibleTickets,
      { bankId, bankTellerId },
      (response: RequestVisibleTicketsResponse) => {
        setTickets(response.tickets);
      }
    );
  }, [socket, bankId, bankTellerId]);

  useEffect(() => {
    if (!socket) return;

    const onTicketCreated = (payload: TicketCreatedPayload) => {
      setTickets((prevTickets) => [...prevTickets, payload.ticket]);
    };

    socket.on(Events.Server.TicketCreated, onTicketCreated);

    return () => {
      socket.off(Events.Server.TicketCreated, onTicketCreated);
    };
  }, [socket]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Tickets asignados o sin asignar
      </h2>
      <ul className="space-y-2">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="p-4 bg-gray-100 rounded shadow">
            <p>
              <strong>Turno:</strong> {ticket.number}
            </p>
            <p>
              <strong>Estado:</strong> {ticket.status}
            </p>
            <p>
              <strong>Asignado a:</strong>{" "}
              {ticket.bank_teller_id ?? "Sin asignar"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
