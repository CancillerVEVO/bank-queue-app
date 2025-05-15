import { TellerTicketInfo } from "@/app/lib/definitions";

type Props = {
  data: TellerTicketInfo;
};

export default function OperatorCard({ data }: Props) {
  const {
    email,
    window_number,
    bank_name,
    image_url,
    background_color,
    button_color,
    current_ticket_number,
    current_ticket_status,
    next_ticket_number,
  } = data;

  return (
    <div className="w-full max-w-md rounded-2xl shadow-lg border border-gray-200 p-5 bg-white flex flex-col gap-4">
      {/* Header: Cajero */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Ventanilla #{window_number}</h2>
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

      {/* Siguiente en cola */}
      <div>
        <h3 className="text-sm text-gray-700 mb-1">⏭️ Siguiente turno</h3>
        {next_ticket_number !== null ? (
          <div className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-50 border">
            <span className="text-xl text-gray-800 font-medium">
              Turno #{next_ticket_number}
            </span>
            <span className="text-sm px-2 py-1 border rounded text-gray-600 border-gray-300">
              waiting
            </span>
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">Nadie en espera</p>
        )}
      </div>

      {/* Footer: Banco */}
      <div className="text-right text-xs text-gray-500 mt-2">{bank_name}</div>
    </div>
  );
}
