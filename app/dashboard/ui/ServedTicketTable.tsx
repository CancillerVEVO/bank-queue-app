import { ServedTicket } from "@/app/lib/definitions";

type Props = {
  tickets: ServedTicket[];
};

export default function ServedTicketTable({ tickets }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Turno
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Ventanilla
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Banco
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              Fecha de atención
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-800 font-semibold">
                #{ticket.number}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">
                {ticket.window_number ? `#${ticket.window_number}` : "N/A"}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">
                {ticket.bank_name}
              </td>
              <td className="px-4 py-2 text-sm text-gray-500">
                {new Date(ticket.updated_at).toLocaleString("es-MX", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tickets.length === 0 && (
        <div className="p-4 text-center text-sm text-gray-500">
          No hay tickets atendidos aún.
        </div>
      )}
    </div>
  );
}
