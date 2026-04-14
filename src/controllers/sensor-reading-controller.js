import { getSensorReadings } from "../services/sensor-reading-service.js";

export async function listSensorReadings(req, res, next) {
  try {
    const limit = Number.parseInt(req.query.limit, 10);
    const sensorReadings = await getSensorReadings({
      deviceId: req.query.device_id,
      limit: Number.isNaN(limit) ? 50 : limit,
    });

    res.json({
      data: sensorReadings,
    });
  }
  catch (error) {
    next(error);
  }
}
