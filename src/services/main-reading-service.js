import { env } from "../env.js";
import {
  createMainReading,
  findLatestMainReading,
  findSensorReadingAveragesWithinLastMinute,
} from "../repositories/main-reading-repository.js";

function toNullableNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? null : numericValue;
}

async function pushMainReading(payload) {
  const response = await fetch(env.MAIN_SERVER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ph: payload.ph,
      cond: payload.cond,
      turbidity: payload.turbidity,
    }),
  });

  if (!response.ok) {
    console.log(`Failed to push main reading. HTTP ${response.status}`);
  }
}

export async function aggregateAndStoreMainReading(referenceTime = new Date()) {
  const averages = await findSensorReadingAveragesWithinLastMinute(referenceTime);
  const wibDate = new Date(referenceTime.getTime() + (7 * 60 * 60 * 1000));

  const payload = {
    timestamp: wibDate,
    ph: toNullableNumber(averages?.ph),
    cond: toNullableNumber(averages?.cond),
    turbidity: toNullableNumber(averages?.turbidity),
  };

  const hasData = [payload.ph, payload.cond, payload.turbidity].some(value => value !== null);

  if (!hasData) {
    return null;
  }

  await pushMainReading(payload);
  return createMainReading(payload);
}

export async function getLatestMainReading() {
  return findLatestMainReading();
}
