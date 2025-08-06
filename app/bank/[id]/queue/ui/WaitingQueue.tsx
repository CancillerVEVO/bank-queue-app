"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocket } from "@/app/contexts/SocketContext";
import { Ticket } from "@/app/lib/definitions";
import {
  Events,
  RequestQueueByBankResponse,
} from "@/app/lib/socket-events";
import TicketCard from "./TicketCard";

type Props = {
  bankId: number;
};

export default function WaitingQueue({ bankId }: Props) {
  const socket = useSocket();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchQueue = useCallback(() => {
    if (!socket) return;

    socket.emit(
      Events.Client.RequestQueueByBank,
      { bankId },
      (response: RequestQueueByBankResponse) => {
        setTickets(response.tickets);
      }
    );
  }, [socket, bankId]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    if (!socket) return;

    const onTicketUpdated = () => {
      // Refetch toda la lista si hay un cambio
      fetchQueue();
    };

    socket.on(Events.Server.TicketUpdated, onTicketUpdated);

    return () => {
      socket.off(Events.Server.TicketUpdated, onTicketUpdated);
    };
  }, [socket, fetchQueue]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
