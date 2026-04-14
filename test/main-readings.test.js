import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({
  getLatestMainReadingMock: vi.fn(),
}));

vi.mock("../src/services/main-reading-service.js", async () => {
  const actual = await vi.importActual("../src/services/main-reading-service.js");

  return {
    ...actual,
    getLatestMainReading: serviceMocks.getLatestMainReadingMock,
  };
});

import app from "../src/app.js";

describe("GET /api/v1/main-readings/latest", () => {
  beforeEach(() => {
    serviceMocks.getLatestMainReadingMock.mockReset();
  });

  it("responds with latest main reading payload", async () => {
    serviceMocks.getLatestMainReadingMock.mockResolvedValue({
      id: 10,
      timestamp: "2026-04-14T10:30:00.000Z",
      ph: "7.11",
      cond: "100.20",
      turbidity: "4.50",
    });

    const response = await request(app)
      .get("/api/v1/main-readings/latest")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "success",
      message: "Latest main reading retrieved successfully.",
      data: {
        id: 10,
        timestamp: "2026-04-14T10:30:00.000Z",
        ph: "7.11",
        cond: "100.20",
        turbidity: "4.50",
      },
    });
  });

  it("responds with empty data when table has no records", async () => {
    serviceMocks.getLatestMainReadingMock.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/v1/main-readings/latest")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "success",
      message: "No main reading data found.",
      data: null,
    });
  });
});
