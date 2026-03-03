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

  socket.join("secret-room");

  socket.on("card_click", (data) => {
    console.log("Received:", data);

    // If custom message
    if (typeof data === "object" && data.message) {
      socket.to("secret-room").emit("show_popup", {
        message: data.message,
      });
    } 
    // If normal card index
    else {
      socket.to("secret-room").emit("show_popup", data);
    }
  });
});app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Running on port", PORT);
});