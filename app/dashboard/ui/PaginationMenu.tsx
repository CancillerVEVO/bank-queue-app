"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationMenuProps = {
  totalPages: number;
  limit?: number;
};

export default function PaginationMenu({ totalPages, limit }: PaginationMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (limit) params.set("limit", limit.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        const isCurrent = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 border rounded transition ${
              isCurrent
                ? "bg-blue-600 text-white font-bold"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
