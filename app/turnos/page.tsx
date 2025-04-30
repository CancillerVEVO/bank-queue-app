"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/app/contexts/SocketContext";

export default function Page() {
    const socket = useSocket();
    const [ticket, setTicket] = useState<number | null>(null);

    const requestTicket = () => {
        socket?.emit("requestTicket");
    };

    useEffect(() => {
        socket?.on("ticketIssued", (data: { ticket: number }) => {
            setTicket(data.ticket);
        });
    }, [socket]);


    return (
        <main className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-3xl font-bold">
                Client
            </h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={requestTicket}>
                Request Ticket
            </button>
            {ticket !== null && <p className="text-xl">Your ticket number is: <strong>{ticket}</strong></p>}
        </main>
    );

}