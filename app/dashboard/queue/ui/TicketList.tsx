"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Events,
  RequestVisibleTicketsResponse,
  CreateTicketPayload,
  TicketCreatedPayload,
  AttendTicketResponse,
  CancelTicketResponse,
  TicketUpdatedPayload,
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

  const updateTicket = useCallback((ticket: Ticket) => {
    setTickets((prevTickets) =>
      prevTickets.map((t) =>
        t.id === ticket.id
          ? {
              ...t,
              status: ticket.status,
              bank_teller_id: ticket.bank_teller_id,
            }
          : t
      )
    );
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onTicketUpdated = (payload: TicketUpdatedPayload) => {
      updateTicket(payload.ticket);
    };

    socket.on(Events.Server.TicketUpdated, onTicketUpdated);

    return () => {
      socket.off(Events.Server.TicketUpdated, onTicketUpdated);
    };
  }, [socket, updateTicket]);

  const onClickAttend = (ticket: Ticket) => {
    if (!socket) return;

    socket.emit(Events.Client.AttendTicket, {
      ticketId: ticket.id,
      bankTellerId,
    });
  };

  const onClickCancel = (ticket: Ticket) => {
    if (!socket) return;

    socket.emit(Events.Client.CancelTicket, {
      ticketId: ticket.id,
      bankTellerId,
    });
  };

  const isSomeAttending = useMemo(() => {
    return tickets.some((ticket) => ticket.status === "serving" && ticket.bank_teller_id === bankTellerId);
  }, [tickets]);

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

            <div className="flex gap-2">
              <button
                onClick={() => onClickAttend(ticket)}
                className="cursor-pointer mt-2 bg-blue-500 text-white py-1 px-3 rounded disabled:bg-gray-300"
                disabled={isSomeAttending || ticket.status === 'serving'}
              >
                Atender
              </button>

              {ticket.status === "serving" && ticket.bank_teller_id === bankTellerId ? (
                <button
                  onClick={() => onClickCancel(ticket)}
                  className="cursor-pointer mt-2 bg-red-500 text-white py-1 px-3 rounded disabled:bg-gray-300"
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
