export enum ClientToServerEvents {
    RequestTicket = "requestTicket",
    ServeNextTicket = "serveNextTicket",
}

export enum ServerToClientEvents {
    TicketIssued = "ticketIssued",
    TicketServed = "ticketServed",
    QueueUpdated = "queueUpdated",
}

export const Events = {
    Client: ClientToServerEvents,
    Server: ServerToClientEvents,
}