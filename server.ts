import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

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
    console.log("Client connected");

    socket.emit("queueUpdated", queue);

    socket.on("requestTicket", () => {
      const ticket = currentTicket++;
      queue.push(ticket);
      socket.emit("ticketIssued", { ticket });
      io.emit("queueUpdated", queue);
    });

    socket.on("serveNextTicket", () => {
      const ticket = queue.shift();
      if (ticket !== undefined) {
        socket.emit("ticketServed", ticket);
        io.emit("queueUpdated", queue);
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