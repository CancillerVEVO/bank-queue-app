import { Ticket } from "./definitions";

// Client envia TicketRequested y Server responde con TicketCreated

export enum ClientToServerEvents {
  RequestVisibleTickets = "requestVisibleTickets", // nuevo nombre más claro
  ServeNextTicket = "serveNextTicket",
  AssignTicket = "assignTicket", // opcional si quieres permitir asignar
  TicketCreated = "ticketCreated", // opcional si quieres permitir asignar

  TicketRequested = "ticketRequested",
}
export type RequestVisibleTicketsPayload = {
  bankId: number;
  bankTellerId: number;
};

export type RequestVisibleTicketsResponse = {
  tickets: Ticket[];
};

export enum ServerToClientEvents {
  QueueUpdated = "queueUpdated", // sigue igual, pero más claro en uso
  TicketIssued = "ticketIssued",
  TicketServed = "ticketServed",

  TicketCreated = "ticketCreated",
}

export type TicketCreatedPayload = {
  ticket: Ticket;
};

export type TicketRequestedPayload = {
  bankId: number;
};

export type TicketRequestedResponse = {
  ticket: Ticket;
};

export type QueueUpdatedPayload = {
  tickets: Ticket[];
};

export const Events = {
  Client: ClientToServerEvents,
  Server: ServerToClientEvents,
};
