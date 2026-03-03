import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*",
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

const ROOM = "secret-room";

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // Join same room
  socket.join(ROOM);

  socket.on("card_click", (index) => {
    console.log("Card clicked:", index);

    // Send to everyone in room EXCEPT sender
    socket.to(ROOM).emit("show_popup", index);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Running on port", PORT);
});