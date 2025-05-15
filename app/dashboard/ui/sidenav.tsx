import Link from "next/link";
import Image from "next/image";
import NavLinks from "./nav-links";
import { PowerIcon } from "@heroicons/react/24/outline";
import { logout } from "@/app/login/actions";
type SideNavProps = {
  imageSrc: string;
  backgroundColor: string;
  activeColor: string;
  email: string;
  bankName: string;
};

export default function SideNav({
  imageSrc,
  backgroundColor,
  activeColor,
  email,
  bankName,
}: SideNavProps) {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* Logo */}
      <Link
        style={{ backgroundColor }}
        className="mb-2 flex items-end justify-start rounded-md p-4"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <Image
            src={imageSrc}
            alt="Logo"
            width={160}
            height={60}
            className="object-contain"
          />
        </div>
      </Link>

      {/* Información del usuario */}
      <div className="mb-4 rounded-md bg-gray-100 p-3 text-xs text-gray-700">
        <p className="mb-1">
          <strong>Usuario:</strong> {email}
        </p>
        <p>
          <strong>Banco:</strong> {bankName}
        </p>
      </div>

      {/* Navegación y logout */}
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks activeColor={activeColor} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block" />
        <form
          action={async () => {
            "use server";
            await logout();
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
