"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main>
      <p className="text-lg">
        Welcome to SmartQueue, your smart queue management system.
      </p>

      <div className="mt-1.5">
        <Link
          href={"/login"}
          className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
