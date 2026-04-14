import { getLatestMainReading } from "../services/main-reading-service.js";

export async function getLatestMainReadingHandler(req, res, next) {
  try {
    const mainReading = await getLatestMainReading();

    res.json({
      status: "success",
      message: mainReading
        ? "Latest main reading retrieved successfully."
        : "No main reading data found.",
      data: mainReading,
    });
  }
  catch (error) {
    next(error);
  }
}
