import express from "express";

require("dotenv").config();

const app = express();

app.get("/", (_req, res) => {
  res.send("dharnbot-server");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`dharnbot-server listening on *:${port}`);
});
