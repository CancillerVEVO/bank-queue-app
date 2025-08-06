import { Metadata } from "next";
import { getBank } from "@/app/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Menu de Turnos",
  description: "Sistema de turnos",
};
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const bankId = parseInt(id);

  const bank = await getBank(bankId);
  if (!bank) {
    notFound();
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col w-full max-w-sm md:max-w-xl gap-6 md:gap-8 p-6 md:p-8 bg-white rounded-2xl shadow-lg">
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

        <p className="text-lg md:text-2xl text-center text-black">
          Hola, bienvenido a <strong>{bank.name}</strong>. Selecciona una de las
          opciones para continuar.
        </p>

        <Link href={`/bank/${params.id}/request-ticket`}>
          <button
            className="text-white text-lg md:text-2xl uppercase py-3 px-6 rounded-lg w-full transition hover:brightness-110"
            style={{ backgroundColor: bank.button_color }}
          >
            Solicitar turno
          </button>
        </Link>
        <Link href={`/bank/${bankId}/queue`}>
          <button
            className="text-white text-lg md:text-2xl uppercase py-3 px-6 rounded-lg w-full transition hover:brightness-110"
            style={{ backgroundColor: bank.button_color }}
          >
            Ver turnos
          </button>
        </Link>
      </div>
    </main>
  );
}
