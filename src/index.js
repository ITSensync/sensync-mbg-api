import app from "./app.js";
import { connectDatabase } from "./database/sequelize.js";
import { env } from "./env.js";
import { startMainReadingCron } from "./jobs/main-reading-cron.js";
import { MainReading, SensorReading } from "./models/index.js";
import { startMainReadingWebSocketServer } from "./websocket/main-reading-websocket.js";

async function startServer() {
  try {
    await connectDatabase();
    await SensorReading.sync();
    await MainReading.sync();
    if (env.NODE_ENV !== "test") {
      startMainReadingWebSocketServer();
      startMainReadingCron();
    }

    const server = app.listen(env.PORT, () => {
      /* eslint-disable no-console */
      console.log(`Listening: http://localhost:${env.PORT}`);
      /* eslint-enable no-console */
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${env.PORT} is already in use. Please choose another port or stop the process using it.`);
      }
      else {
        console.error("Failed to start server:", err);
      }
      process.exit(1);
    });
  }
  catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

startServer();
