import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { findAllMock } = vi.hoisted(() => ({
  findAllMock: vi.fn(),
}));

vi.mock("../src/models/index.js", () => ({
  SensorReading: {
    findAll: findAllMock,
  },
}));

import app from "../src/app.js";

describe("GET /api/v1/sensor-readings", () => {
  beforeEach(() => {
    findAllMock.mockReset();
  });

  it("responds with sensor reading data", async () => {
    findAllMock.mockResolvedValue([
      {
        id: 1,
        device_id: "dev-01",
        ph: "7.12",
        sensor_stat: "active",
        cond: "100.10",
        turbidity: "5.20",
      },
    ]);

    const response = await request(app)
      .get("/api/v1/sensor-readings?limit=10&device_id=dev-01")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        {
          id: 1,
          device_id: "dev-01",
          ph: "7.12",
          sensor_stat: "active",
          cond: "100.10",
          turbidity: "5.20",
        },
      ],
    });

    expect(findAllMock).toHaveBeenCalledWith({
      where: {
        device_id: "dev-01",
      },
      order: [["timestamp", "DESC"]],
      limit: 10,
    });
  });
});
