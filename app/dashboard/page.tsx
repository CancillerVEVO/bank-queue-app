import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";
import { getEmployeeContext } from "@/app/lib/data";
import LogoutButton from "./ui/logout-button";
import Image from "next/image";

export default async function Page() {
  const cookieStore = cookies();
  const session = (await cookieStore).get("session")?.value;
  const payload = await decrypt(session);

  if (!payload) {
    return <div>Session expired. Please log in again.</div>;
  }

  const userId = payload.userId;

  const employeContext = await getEmployeeContext(Number(userId));
  if (!employeContext) {
    return <div>Employee context not found.</div>;
  }

  const {
    email,
    bank_name,
    image_url,
    background_color,
    window_number,
    button_color,
  } = employeContext;

  return (
    <main>
      {/* Header personalizado */}
      <header
        className="flex items-center px-6 py-4 shadow-md text-white"
        style={{ backgroundColor: background_color }}
      >
        <Image src={image_url} alt="Bank logo" width={300} height={300}/>
      </header>

      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 w-96">
          <h2 className="text-xl font-semibold mb-2">Welcome, {email}</h2>
          <p className="text-gray-700 mb-2">
            You are logged in as a bank teller.
          </p>
          <p className="text-gray-700 mb-2">Window Number: {window_number}</p>
        </div>

        {/* Logout */}
        <div className="flex justify-center mt-4">
          <LogoutButton color={button_color} />
        </div>
      </div>
    </main>
  );
}
