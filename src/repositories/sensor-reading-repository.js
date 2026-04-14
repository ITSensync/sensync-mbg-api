import { SensorReading } from "../models/index.js";

export async function findSensorReadings({ deviceId, limit }) {
  const where = deviceId
    ? { device_id: deviceId }
    : undefined;

  return SensorReading.findAll({
    where,
    order: [["timestamp", "DESC"]],
    limit,
  });
}
