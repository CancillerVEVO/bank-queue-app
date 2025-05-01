export type TicketStatus = "waiting" | "serving" | "served";

export type Ticket = {
  id: number;
  number: number;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
};