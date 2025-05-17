import { getEmployeeContext } from "@/app/lib/data";
import TicketList from "./ui/TicketList";
import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";

export default async function page() {
  const cookieStore = cookies();
  const session = (await cookieStore).get("session")?.value;
  const payload = await decrypt(session);

  const userId = payload?.userId;
  if (!userId) return <div>Session expired. Please log in again.</div>;

  const employeeContext = await getEmployeeContext(Number(userId));
  if (!employeeContext) return <div>Employee context not found.</div>;

  return (
    <main>
      <h1>QUEUE</h1>
      <TicketList
        bankId={employeeContext.bank_id}
        bankTellerId={employeeContext.bank_teller_id}
      />
    </main>
  );
}
