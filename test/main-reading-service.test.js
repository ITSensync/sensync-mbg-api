import { beforeEach, describe, expect, it, vi } from "vitest";

const repositoryMocks = vi.hoisted(() => ({
  createMainReadingMock: vi.fn(),
  findSensorReadingAveragesWithinLastMinuteMock: vi.fn(),
}));

vi.mock("../src/repositories/main-reading-repository.js", () => ({
  createMainReading: repositoryMocks.createMainReadingMock,
  findSensorReadingAveragesWithinLastMinute: repositoryMocks.findSensorReadingAveragesWithinLastMinuteMock,
}));

import { aggregateAndStoreMainReading } from "../src/services/main-reading-service.js";

describe("aggregateAndStoreMainReading", () => {
  beforeEach(() => {
    repositoryMocks.createMainReadingMock.mockReset();
    repositoryMocks.findSensorReadingAveragesWithinLastMinuteMock.mockReset();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    });
  });

  it("stores averaged ph, cond, and turbidity into main_tb payload", async () => {
    repositoryMocks.findSensorReadingAveragesWithinLastMinuteMock.mockResolvedValue({
      ph: "7.23",
      cond: "101.5",
      turbidity: "4.1",
    });
    repositoryMocks.createMainReadingMock.mockResolvedValue({
      id: 1,
      ph: 7.23,
      cond: 101.5,
      turbidity: 4.1,
    });

    const result = await aggregateAndStoreMainReading(new Date("2026-04-14T09:00:00.000Z"));

    expect(repositoryMocks.findSensorReadingAveragesWithinLastMinuteMock).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://secure.getsensync.com/sensync-mbg/api/Insert.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ph: 7.23,
          cond: 101.5,
          turbidity: 4.1,
        }),
      },
    );
    expect(repositoryMocks.createMainReadingMock).toHaveBeenCalledWith({
      timestamp: new Date("2026-04-14T16:00:00.000Z"),
      ph: 7.23,
      cond: 101.5,
      turbidity: 4.1,
    });
    expect(result).toEqual({
      id: 1,
      ph: 7.23,
      cond: 101.5,
      turbidity: 4.1,
    });
  });

  it("skips insert when no sensor data exists in the last minute", async () => {
    repositoryMocks.findSensorReadingAveragesWithinLastMinuteMock.mockResolvedValue({
      ph: null,
      cond: null,
      turbidity: null,
    });

    const result = await aggregateAndStoreMainReading();

    expect(repositoryMocks.createMainReadingMock).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it("does not insert local data when push to remote server fails", async () => {
    repositoryMocks.findSensorReadingAveragesWithinLastMinuteMock.mockResolvedValue({
      ph: "7.23",
      cond: "101.5",
      turbidity: "4.1",
    });
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(aggregateAndStoreMainReading(new Date("2026-04-14T09:00:00.000Z")))
      .rejects
      .toThrow("Failed to push main reading. HTTP 500");

    expect(repositoryMocks.createMainReadingMock).not.toHaveBeenCalled();
  });
});
