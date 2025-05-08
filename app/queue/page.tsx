"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/app/contexts/SocketContext";
import { Ticket } from "@/app/lib/definitions";
import { Events } from "@/app/lib/socket-events";

export default function Page() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [newTicket, setNewTicket] = useState<Ticket | null>(null);
    const socket = useSocket();

    useEffect(() => {
        socket?.on(Events.Server.TicketIssued, (ticket: Ticket) => {
            setNewTicket(ticket);
        })

        socket?.on(Events.Server.QueueUpdated, (queue: Ticket[]) => {
            setTickets(queue);
        })
    }, [[]])


    const handleRequestTicket = async () => {
        socket?.emit(Events.Client.RequestTicket)
    }

    return (
        <main
            className="flex flex-col items-center justify-between p-24"
        >

            <h1 className="text-4xl font-bold">Turnos</h1>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleRequestTicket}
            >
                Solicitar turno
            </button>

            {newTicket && (
                <div className="mt-4">
                    <p className="text-lg">Nuevo turno: {newTicket.number}</p>
                </div>
            )}

            <ul className="mt-4">
                {tickets.map(ticket => (
                    <li key={ticket.id} className="border p-2">
                        Turno: {ticket.number}
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                <p className="text-lg">Turnos en espera: {tickets.length}</p>
            </div>
            <div className="mt-4">
                <p className="text-lg">Turno actual: {tickets[0]?.number || "Ninguno"}</p>
            </div>

        </main>
    )
}