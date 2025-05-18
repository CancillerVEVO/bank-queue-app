// components/TicketCard.tsx

import { Ticket } from "@/app/lib/definitions"; // Asegúrate de tener la definición de tipo Ticket en tu proyecto
type Props = {
  ticket: Ticket;
};
export default function TicketCard({ ticket }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Turno {ticket.number}
        </h3>
        <span className="text-sm text-gray-500">Status: {ticket.status}</span>
      </div>
    </div>
  );
}
