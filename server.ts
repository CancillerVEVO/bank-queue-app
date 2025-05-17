import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import {
  Events,
  CreateTicketPayload,
  RequestVisibleTicketsPayload,
  RequestVisibleTicketsResponse,
  TicketCreatedPayload,
  CancelTicketPayload,
  AttendTicketPayload,
  TicketUpdatedPayload,
} from "@/app/lib/socket-events";
import { createTicket, attendTicket, cancelTicket } from "@/app/lib/actions";
import { getTicketsForTeller } from "@/app/lib/data";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on(
      Events.Client.RequestVisibleTickets,
      async (payload: RequestVisibleTicketsPayload, callback) => {
        const tickets = await getTicketsForTeller(
          payload.bankId,
          payload.bankTellerId
        );

        const response: RequestVisibleTicketsResponse = {
          tickets,
        };

        callback?.(response);
      }
    );

    socket.on(
      Events.Client.CreateTicket,
      async (payload: CreateTicketPayload, callback) => {
        const ticket = await createTicket(payload.bankId);

        io.emit(Events.Server.TicketCreated, {
          ticket,
        } satisfies TicketCreatedPayload);

        callback?.({ ticket });
      }
    );

    socket.on(
      Events.Client.AttendTicket,
      async (payload: AttendTicketPayload, callback) => {
        const ticket = await attendTicket({
          ticketId: payload.ticketId,
          bankTellerId: payload.bankTellerId,
        });

        io.emit(Events.Server.TicketUpdated, {
          ticket: ticket!,
        } satisfies TicketUpdatedPayload);

        callback?.({ ticket });
      }
    );

    socket.on(
      Events.Client.CancelTicket,
      async (payload: CancelTicketPayload, callback) => {
        const ticket = await cancelTicket(payload.ticketId);

        io.emit(Events.Server.TicketUpdated, {
          ticket: ticket!,
        } satisfies TicketUpdatedPayload);

        callback?.({ ticket });
      }
    );
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
