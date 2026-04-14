import cron from "node-cron";

import { env } from "../env.js";
import { aggregateAndStoreMainReading } from "../services/main-reading-service.js";
import { broadcastLatestMainReading } from "../websocket/main-reading-websocket.js";

export function startMainReadingCron() {
  return cron.schedule(env.MAIN_READING_CRON, async () => {
    try {
      const result = await aggregateAndStoreMainReading();

      if (!result) {
        console.warn("Main reading cron skipped: no sensor data found in the last minute.");
        return;
      }

      console.warn("Main reading cron stored averaged sensor data.");
      await broadcastLatestMainReading();
    }
    catch (error) {
      console.error("Main reading cron failed:", error);
    }
  }, {
    timezone: env.CRON_TIMEZONE,
  });
}
