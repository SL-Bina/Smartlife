import WebSocket from "ws";

const ws = new WebSocket("wss://echo.websocket.events");

ws.on("open", () => {
  console.log("connected");
  ws.send("hello");
});

ws.on("message", (data) => {
  console.log("server:", data.toString());
});