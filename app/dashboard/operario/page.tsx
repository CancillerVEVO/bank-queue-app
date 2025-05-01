"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/app/contexts/SocketContext";

export default function Page() {
    const socket = useSocket();
    const [queue, setQueue] = useState<number[]>([]);
    const [serving, setServing] = useState<number | null>(null);

    const serveNextTicket = () => {
        socket?.emit("serveNextTicket");
    }

    useEffect(() => {
        socket?.on("queueUpdated", (data: number[]) => {
            setQueue(data);
        });

        socket?.on("ticketServed", (ticket: number) => {
            setServing(ticket);
        });
    }, [socket])

    return (
        <main className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-3xl font-bold">Operator Dashboard</h1>
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={serveNextTicket}>
                Serve Next Ticket
            </button>
            {serving !== null && <p>Currently serving: <strong>{serving}</strong></p>}
            <h2 className="mt-4 font-semibold">Current Queue:</h2>
            <ul className="text-center">
                {queue.map((ticket) => (
                    <li key={ticket}>Ticket {ticket}</li>
                ))}
            </ul>
        </main>
    )

}