import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import {
  Events,
  QueueUpdatedPayload,
  TicketRequestedPayload,
  RequestVisibleTicketsPayload,
  RequestVisibleTicketsResponse,
} from "@/app/lib/socket-events";
import { createTicket, serveNextTicket } from "@/app/lib/actions";
import { getTicketsByEmployeeId, getTicketsForTeller } from "@/app/lib/data";

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

        callback(response);
      }
    );

    socket.on(
      Events.Client.TicketRequested,
      async (payload: TicketRequestedPayload, callback) => {
        const ticket = await createTicket(payload.bankId);

        io.emit(Events.Server.TicketCreated, { ticket });

        callback({ ticket });
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
