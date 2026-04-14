import { WebSocketServer } from "ws";

import { env } from "../env.js";
import { getLatestMainReading } from "../services/main-reading-service.js";

let websocketServer;

function serializeMainReading(mainReading) {
  if (!mainReading) {
    return null;
  }

  if (typeof mainReading.toJSON === "function") {
    return mainReading.toJSON();
  }

  return mainReading;
}

async function buildLatestMainReadingMessage() {
  const latestMainReading = await getLatestMainReading();

  return JSON.stringify({
    event: "main-reading.latest",
    data: serializeMainReading(latestMainReading),
  });
}

export async function broadcastLatestMainReading() {
  if (!websocketServer) {
    return;
  }

  const message = await buildLatestMainReadingMessage();

  for (const client of websocketServer.clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}

export function startMainReadingWebSocketServer() {
  websocketServer = new WebSocketServer({
    port: env.WS_PORT,
  });

  websocketServer.on("connection", async (socket) => {
    try {
      socket.send(await buildLatestMainReadingMessage());
    }
    catch (error) {
      socket.send(JSON.stringify({
        event: "main-reading.error",
        message: "Failed to load latest main reading.",
      }));
      console.error("WebSocket initial send failed:", error);
    }
  });

  websocketServer.on("listening", () => {
    console.warn(`WebSocket listening on ws://localhost:${env.WS_PORT}`);
  });

  websocketServer.on("error", (error) => {
    console.error("WebSocket server failed:", error);
  });

  return websocketServer;
}
