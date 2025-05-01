import { Ticket } from "@/app/lib/definitions";

export const tickets: Omit<Ticket, "id" | "created_at" | "updated_at">[] = [
    { number: 1, status: "waiting" },
    { number: 2, status: "waiting" },
    { number: 3, status: "waiting" },
  ];