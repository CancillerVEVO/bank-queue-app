import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import {
  countServedTicketsByBank,
  getEmployeeContext,
  getPaginatedServedTicketsByBank,
  getTicketStatusDistribution,
} from "@/app/lib/data";
import ServedTicketTable from "./ui/ServedTicketTable";
import { headers } from "next/headers";
import PaginationMenu from "./ui/PaginationMenu";
import TicketDistributionBarChart from "./ui/TicketDistributionBarChart";

export default async function DashboardPage(props: {
  searchParams?: Promise<{
    limit?: string;
    page?: string;
  }>;
}) {
  const cookieStore = cookies();
  const session = (await cookieStore).get("session")?.value;
  const payload = await decrypt(session);

  const searchParams = await props.searchParams;

  const userId = payload?.userId;
  if (!userId) return <div>Session expired. Please log in again.</div>;

  const employeeContext = await getEmployeeContext(Number(userId));
  if (!employeeContext) return <div>Employee context not found.</div>;

  const page = Math.max(1, parseInt(searchParams?.page || "1"));
  const limit = Math.min(
    Math.max(5, parseInt(searchParams?.limit || "10")),
    50
  ); // max 50 por seguridad
  const offset = (page - 1) * limit;

  const [tickets, total, ticketDistribution] = await Promise.all([
    getPaginatedServedTicketsByBank(employeeContext.bank_id, limit, offset),
    countServedTicketsByBank(employeeContext.bank_id),
    getTicketStatusDistribution(employeeContext.bank_id),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Tickets atendidos
        </h2>
        <ServedTicketTable tickets={tickets} />
        <div className="mt-4">
          <PaginationMenu totalPages={totalPages} limit={limit} />
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Distribución de tickets
        </h2>
        <TicketDistributionBarChart data={ticketDistribution} />
      </section>
    </div>
  );
}
