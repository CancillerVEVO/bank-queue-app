import { Ticket } from "./definitions";

// Client

export enum ClientToServerEvents {
  RequestVisibleTickets = "requestVisibleTickets", // nuevo nombre más claro
  CreateTicket = "createTicket",
  AttendTicket = "attendTicket",
  CancelTicket = "cancelTicket",
}
export type RequestVisibleTicketsPayload = {
  bankId: number;
  bankTellerId: number;
};

export type RequestVisibleTicketsResponse = {
  tickets: Ticket[];
};

export type CreateTicketPayload = {
  bankId: number;
};

export type CreateTicketResponse = {
  ticket: Ticket;
};

export type AttendTicketPayload = {
  ticketId: number;
  bankTellerId: number;
};

export type AttendTicketResponse = {
  ticket: Ticket;
};

export type CancelTicketPayload = {
  ticketId: number;
};

export type CancelTicketResponse = {
  ticket: Ticket;
};

// Server

export enum ServerToClientEvents {
  TicketCreated = "ticketCreated",
  TicketUpdated = "ticketUpdated",
}

export type TicketCreatedPayload = {
  ticket: Ticket;
};

export type TicketUpdatedPayload = {
  ticket: Ticket;
};

export const Events = {
  Client: ClientToServerEvents,
  Server: ServerToClientEvents,
};