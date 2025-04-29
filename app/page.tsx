"use client";
import { useEffect, useState } from "react";
import { socket } from "@/app/lib/socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      handleConnect();
    }

    function handleConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }
    function handleDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    }
  }, []);
  return (
    <div>
      <p>Status: { isConnected ? "connected" : "disconnected" }</p>
      <p>Transport: { transport }</p>

      <div>
        
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              socket.emit("message", "Hello from client");

              socket.on("messageResponse", (data) => {
                console.log("messageResponse: ", data);
              });
            }}
          >
            Send Message
          </button>
      </div>
    </div>
  );
}
