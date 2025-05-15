import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { getEmployeeContext } from "@/app/lib/data";
import { type EmployeeContext } from "@/app/lib/definitions";
import SideNav from "./ui/sidenav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const session = (await cookieStore).get("session")?.value;
  const payload = await decrypt(session);

  const userId = payload?.userId;
  if (!userId) return <div>Session expired. Please log in again.</div>;

  const employeeContext = await getEmployeeContext(Number(userId));
  if (!employeeContext) return <div>Employee context not found.</div>;

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav
          imageSrc={employeeContext.image_url}
          backgroundColor={employeeContext.background_color}
          activeColor={employeeContext.button_color}
          email={employeeContext.email}
          bankName={employeeContext.bank_name}
        />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
