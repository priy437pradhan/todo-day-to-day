import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

const ROOM_ID = "secret-room-1";

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.join(ROOM_ID);

  socket.on("card_click", (index) => {
    socket.to(ROOM_ID).emit("show_popup", index);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log("Running on port", PORT);
});