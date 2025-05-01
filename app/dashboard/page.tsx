"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/app/contexts/SocketContext";
import { Ticket } from "@/app/lib/definitions";
import { Events } from "@/app/lib/socket-events";


export default function Page() {
    const socket = useSocket();
    const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
    const [queue, setQueue] = useState<Ticket[]>([]);


    useEffect(() => {
        if (!socket) return;

        socket.on(Events.Server.TicketServed, (ticket: Ticket) => {
            setCurrentTicket(ticket);
        });

        socket.on(Events.Server.QueueUpdated, (queue: Ticket[]) => {
            setQueue(queue);
        });

        return () => {
            socket.off(Events.Server.TicketServed);
            socket.off(Events.Server.QueueUpdated);
        };
    }, [socket])



    const handleServeNextTicket = () => {
        if (!socket) return;
        socket.emit(Events.Client.ServeNextTicket);
    }



    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
          <h1 className="text-3xl font-bold mb-6">Operator Dashboard</h1>
    
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Now Serving</h2>
            {currentTicket ? (
              <div className="text-5xl font-bold text-blue-600 text-center mb-4">
                {currentTicket.number}
              </div>
            ) : (
              <div className="text-center text-gray-500 mb-4">No ticket yet</div>
            )}
            <button
              onClick={handleServeNextTicket}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
            >
              Serve Next Ticket
            </button>
          </div>
    
          <div className="mt-8 bg-white p-4 rounded-xl shadow w-full max-w-md">
            <h3 className="text-lg font-medium mb-2">Waiting Queue</h3>
            {queue.length > 0 ? (
              <ul className="space-y-1">
                {queue.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="border-b last:border-b-0 py-1 px-2 text-gray-700"
                  >
                    Ticket #{ticket.number}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Queue is empty</p>
            )}
          </div>
        </main>
      );

}