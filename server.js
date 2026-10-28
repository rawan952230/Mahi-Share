const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const rooms = new Map();

app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (_req, res) => res.json({ ok: true, app: "MAHI SHARE" }));

function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}
function leave(ws) {
  const room = ws.room;
  if (!room) return;
  const peers = rooms.get(room);
  if (peers) {
    peers.delete(ws);
    for (const peer of peers) send(peer, { type: "peer-left" });
    if (peers.size === 0) rooms.delete(room);
  }
  ws.room = null;
}
wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    if (msg.type === "join") {
      const room = String(msg.room || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
      if (!room) return send(ws, { type: "error", message: "Invalid room code." });
      leave(ws);
      let peers = rooms.get(room);
      if (!peers) { peers = new Set(); rooms.set(room, peers); }
      if (peers.size >= 2) return send(ws, { type: "error", message: "This room already has two devices. Create a new room." });
      ws.room = room;
      ws.isInitiator = peers.size === 0;
      peers.add(ws);
      send(ws, { type: "joined", room, initiator: ws.isInitiator, peerCount: peers.size });
      if (peers.size === 2) {
        for (const peer of peers) send(peer, { type: "peer-ready" });
      }
      return;
    }
    if (!ws.room) return;
    if (!["offer", "answer", "candidate", "hangup"].includes(msg.type)) return;
    const peers = rooms.get(ws.room);
    if (!peers) return;
    for (const peer of peers) if (peer !== ws) send(peer, msg);
  });
  ws.on("close", () => leave(ws));
  ws.on("error", () => leave(ws));
});
const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => console.log(`MAHI SHARE listening on ${port}`));
