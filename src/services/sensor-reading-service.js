import { findSensorReadings } from "../repositories/sensor-reading-repository.js";

export async function getSensorReadings(filters) {
  return findSensorReadings(filters);
}
