"use client";
import {
  UserGroupIcon,
  HomeIcon,
    QueueListIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavLinkProps {
    activeColor: string;
}

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Turnos",
    href: "/dashboard/queue",
    icon:  QueueListIcon,
  },
];

export default function NavLinks({activeColor}: NavLinkProps) {
  const pathname = usePathname();
    return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[49px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-gray-50 text-gray-900": !isActive,
              }
            )}
            style={isActive ? { backgroundColor: activeColor, color: "#fff" } : {}}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
