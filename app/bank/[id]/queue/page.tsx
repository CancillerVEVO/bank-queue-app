import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBank, getQueueByBank } from "@/app/lib/data"; // Ajusta según la ruta real de tus funciones
import { TicketCard } from "@/app/ui/tickets/TicketCard";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Cola de Turnos",
  description: "Lista de turnos en espera",
};

export default async function QueuePage({
  params,
}: {
  params: { id: string };
}) {
  // Convertir el parámetro dinámico a number
  const { id } = await params;
  const bankId = parseInt(id);

  // Obtener información del banco
  const bank = await getBank(bankId);
  if (!bank) {
    notFound();
  }

  // Cargar la cola de turnos asociados a este banco
  const queue = await getQueueByBank(bankId);

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <header
        className="w-full px-6 py-4 shadow-md flex items-center justify-center"
        style={{ backgroundColor: bank.background_color }}
      >
        <div className="max-w-xs w-full flex justify-center">
          <Image
            src={bank.image_url}
            alt={`${bank.name} logo`}
            width={150}
            height={150}
            className="object-contain h-16 md:h-20"
          />
        </div>
      </header>

      <div className="flex-1 w-full max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Turnos 
        </h1>

        {queue.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {queue.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No hay turnos en espera.
          </p>
        )}
      </div>
    </main>
  );
}
