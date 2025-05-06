"use client";

import { logout } from "@/app/login/actions";

type LogoutButtonProps = {
  color: string;
};

export default function LogoutButton({ color }: LogoutButtonProps) {
  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={async () => {
          await logout();
        }}
        style={{ backgroundColor: color }}
        className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
}
