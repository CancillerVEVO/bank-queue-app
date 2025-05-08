import { Metadata } from "next";
import { getBank } from "@/app/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";

const metadata: Metadata = {
  title: "Turnos",
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

  {
    /* */
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col max-w-xl w-full gap-8 p-4 rounded-lg shadow-lg">
      <div style={{ backgroundColor: bank.background_color }} className="flex items-center justify-center p-8 h-28 rounded-lg">
        <Image
          src={bank.image_url}
          alt={`${bank.name} logo`}
          width={300}
          height={300}
          className="w-[70%] h-full object-contain"
        />
      </div>
      <p className="text-2xl text-black px-4">
        Hola bienvenido a <strong>{bank.name}</strong>, aquí podrás solicitar un turno para ser atendido en ventanilla.

      </p>

      <button className="text-white p-4 rounded-lg text-2xl uppercase"
        style={{ backgroundColor: bank.button_color }}
      >
        Solicitar turno
      </button>
      </div>
    </main>
  );
}
