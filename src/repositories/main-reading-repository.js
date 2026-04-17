import { col, fn, Op } from "sequelize";

import { MainReading, SensorReading } from "../models/index.js";

function addSevenHours(value) {
  return new Date(value.getTime() + (7 * 60 * 60 * 1000));
}

export async function findSensorReadingAveragesWithinLastMinute(referenceTime = new Date()) {
  const endTime = addSevenHours(new Date(referenceTime));
  const startTime = addSevenHours(new Date(referenceTime.getTime() - 60 * 1000));

  console.log(startTime, endTime);

  return SensorReading.findOne({
    raw: true,
    attributes: [
      [fn("AVG", col("ph")), "ph"],
      [fn("AVG", col("cond")), "cond"],
      [fn("AVG", col("turbidity")), "turbidity"],
    ],
    where: {
      timestamp: {
        [Op.gte]: startTime,
        [Op.lt]: endTime,
      },
    },
  });
}

export async function createMainReading(payload) {
  return MainReading.create(payload);
}

export async function findLatestMainReading() {
  return MainReading.findOne({
    order: [["timestamp", "DESC"]],
  });
}
