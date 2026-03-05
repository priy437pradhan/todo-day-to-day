import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import webpush from "web-push";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

const ROOM = "secret-room";

/* ================= VAPID KEYS ================= */

webpush.setVapidDetails(
  "mailto:test@test.com",
  "BDXvOEj-7oFPnFaim9w7_sIESpsuZMhrf02nXqwyd-_hODLZvreLlEfMMLWt1-0h4wa9JCEpNNYoANVXltvOS3o",
  "hD-sjy1sOGzeSIHmwduz4wLYS8rJQKQlA6Rrz3_TBss"
);

/* ================= SUBSCRIPTIONS ================= */

let subscriptions = [];

app.post("/subscribe", (req, res) => {
  const sub = req.body;

  const exists = subscriptions.find(
    s => s.endpoint === sub.endpoint
  );

  if (!exists) {
    subscriptions.push(sub);
  }

  res.status(201).json({});
});

/* ================= SEND PUSH ================= */

function sendPush(message) {

  const payload = JSON.stringify({
    title: "GitHub Notification",
    message
  });

  subscriptions.forEach((sub, index) => {

    webpush.sendNotification(sub, payload)
      .catch(() => {
        subscriptions.splice(index, 1);
      });

  });

}

/* ================= SOCKET ================= */

io.on("connection", (socket) => {

  console.log("Connected:", socket.id);

  socket.join(ROOM);

  socket.on("card_click", (data) => {

    const message = data.message || data;

    socket.to(ROOM).emit("show_popup", { message });

    sendPush(message);

  });

});

app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Running on port", PORT);
});