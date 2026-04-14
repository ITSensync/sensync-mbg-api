import express from "express";

import { listSensorReadings } from "../controllers/sensor-reading-controller.js";

const router = express.Router();

router.get("/", listSensorReadings);

export default router;
