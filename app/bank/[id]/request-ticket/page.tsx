import { Metadata } from "next";
import { getBank } from "@/app/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CreateTicketForm } from "./ui/CreateTickerForm";

// Puedes exportar metadata si es necesario
export const metadata: Metadata = {
  title: "Solicitar Turno",
  description: "Solicitar un turno para el banco",
};

export default async function Page({ params }: { params: { id: string } }) {
  const {id}= await params;
  const bank = await getBank(Number(id));
  if (!bank) {
    notFound();
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col w-full max-w-sm md:max-w-xl gap-6 md:gap-8 p-6 md:p-8 bg-white rounded-2xl shadow-lg">
        {/* Banner del banco */}
        <div
          style={{ backgroundColor: bank.background_color }}
          className="flex items-center justify-center p-6 md:p-8 h-24 md:h-28 rounded-lg"
        >
          <Image
            src={bank.image_url}
            alt={`${bank.name} logo`}
            width={300}
            height={300}
            className="w-[70%] h-full object-contain"
          />
        </div>

        {/* Leyenda */}
        <p className="text-sm md:text-base text-center text-gray-600 font-medium">
          SI QUIERES CREAR UN TURNO DA CLICK EN EL BOTÓN. RECUERDA GUARDAR EL
          NÚMERO DE TICKET.
        </p>

        <CreateTicketForm bankId={bank.id} buttonColor={bank.button_color} />
      </div>
    </main>
  );
}
