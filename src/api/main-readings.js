import express from "express";

import { getLatestMainReadingHandler } from "../controllers/main-reading-controller.js";

const router = express.Router();

router.get("/latest", getLatestMainReadingHandler);

export default router;
