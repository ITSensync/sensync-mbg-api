import express from "express";

import mainReadingsRouter from "./main-readings.js";
import sensorReadingsRouter from "./sensor-readings.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/main-readings", mainReadingsRouter);
router.use("/sensor-readings", sensorReadingsRouter);

export default router;
