"use client";

import { useSocket } from "@/app/contexts/SocketContext";
import { TellerTicketInfo } from "@/app/lib/definitions";
import { Events, TicketUpdatedPayload } from "@/app/lib/socket-events";
import { useEffect, useState } from "react";

type Props = {
  data: TellerTicketInfo;
};

export default function OperatorCard({ data }: Props) {
  const [
    {
      email,
      window_number,
      bank_name,
      button_color,
      current_ticket_number,
      current_ticket_status,
    },
    setData,
  ] = useState(data);

  // console.log(next_ticket_id)

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const onTicketUpdated = (payload: TicketUpdatedPayload) => {
      const ticket = payload.ticket;

      setData((prevData) => {
        const newData = {
          ...prevData,
        };

        if (prevData.bank_teller_id === ticket.bank_teller_id) {
          newData.current_ticket_status = ticket.status;
          newData.current_ticket_created_at = ticket.created_at;
          newData.current_ticket_number = ticket.number;
          newData.current_ticket_id = ticket.id;
        }

        if (
          prevData.current_ticket_id === ticket.id &&
          (ticket.status === "waiting" || ticket.status === "served")
        ) {
          newData.current_ticket_created_at = null;
          newData.current_ticket_id = null;
          newData.current_ticket_status = null;
          newData.current_ticket_number = null;
        } else if (prevData.current_ticket_id === ticket.id) {
          newData.current_ticket_status = ticket.status;
          newData.current_ticket_number = ticket.number;
        }

        return newData;
      });
    };

    socket.on(Events.Server.TicketUpdated, onTicketUpdated);

    return () => {
      socket.off(Events.Server.TicketUpdated, onTicketUpdated);
    };
  }, [socket]);

  return (
    <div className="w-full max-w-md rounded-2xl shadow-lg border border-gray-200 p-5 bg-white flex flex-col gap-4">
      {/* Header: Cajero */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Ventanilla #{window_number}
          </h2>
          <p className="text-sm font-semibold text-gray-500">{email}</p>
        </div>
      </div>

      {/* Ticket actual */}
      <div>
        <h3 className="text-sm text-gray-700 mb-1">🎟️ Atendiendo</h3>
        {current_ticket_number !== null ? (
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50 border">
            <span className="text-xl font-bold text-gray-800">
              Turno #{current_ticket_number}
            </span>
            <span
              className="text-sm font-medium px-2 py-1 rounded"
              style={{ backgroundColor: button_color, color: "white" }}
            >
              {current_ticket_status}
            </span>
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">Sin ticket asignado</p>
        )}
      </div>

      {/* Footer: Banco */}
      <div className="text-right text-xs text-gray-500 mt-2">{bank_name}</div>
    </div>
  );
}
