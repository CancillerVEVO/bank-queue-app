"use client";

import { TicketStatusCount } from "@/app/lib/definitions";

type Props = {
  data: TicketStatusCount[];
};

const colors: Record<string, string> = {
  waiting: "bg-yellow-400",
  serving: "bg-blue-500",
  served: "bg-green-500",
};

export default function TicketDistributionBarChart({ data }: Props) {
  const total = data.reduce((sum, item) => sum + parseInt(item.count), 0);

  if (total === 0) {
    return <p className="text-gray-500 italic">No hay tickets para mostrar.</p>;
  }

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      {data.map(({ status, count }) => {
        const countNum = parseInt(count);
        const percentage = ((countNum / total) * 100).toFixed(1);

        return (
          <div key={status} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="capitalize font-medium text-gray-700">
                {status}
              </span>
              <span className="text-sm text-gray-600">
                {count} ({percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`${
                  colors[status] || "bg-gray-400"
                } h-4 rounded-full`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
