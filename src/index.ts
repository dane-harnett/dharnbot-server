import express from "express";
import { createServer } from "http";
import socketio from "socket.io";

require("dotenv").config();

const app = express();
const http = createServer(app);
const io = socketio(http);

app.get("/", (_req, res) => {
  res.send("dharnbot-server");
});

io.on("connection", (_socket) => {
  console.log("a client connected to socket");
});

const port = process.env.PORT;
http.listen(port, () => {
  console.log(`dharnbot-server listening on *:${port}`);
});
