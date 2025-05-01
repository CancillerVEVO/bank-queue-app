import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { Events } from "@/app/lib/socket-events";
import { createTicket, serveNextTicket } from "@/app/lib/actions";
import { getQueue } from "@/app/lib/data";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let queue: number[] = [];
let currentTicket = 1;

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on(Events.Client.RequestTicket, async () => {
      const ticket = await createTicket();
      socket.emit(Events.Server.TicketIssued, ticket);

      const queue = await getQueue();
      io.emit(Events.Server.QueueUpdated, queue);
    });

    socket.on(Events.Client.ServeNextTicket, async () => {
      const ticket = await serveNextTicket();

      if (ticket) {
        io.emit(Events.Server.TicketServed, ticket);
        const queue = await getQueue();
        io.emit(Events.Server.QueueUpdated, queue);
      }
    });
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