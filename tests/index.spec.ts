import { expect, describe, it, beforeEach } from "vitest";
import { Scheduler } from "../src/index";

describe("Scheduler", () => {
  let scheduler: Scheduler;

  beforeEach(() => {
    scheduler = new Scheduler({
      hours: {
        0: null,
        1: [
          { start: "09:00", end: "12:00" },
          { start: "13:00", end: "18:00" },
        ],
        2: [
          { start: "09:00", end: "12:00" },
          { start: "13:00", end: "18:00" },
        ],
        3: [{ start: "09:00", end: "12:00" }],
        4: [{ start: "09:00", end: "18:00" }],
        5: [{ start: "09:00", end: "18:00" }],
        6: null,
      },
      holidays: [
        new Date("2024-03-08"),
        new Date("2024-03-09"),
        new Date("2024-03-10"),
      ],
    });
  });

  it.only("nextWorkingTime should return the next working time", () => {
    const date = new Date("2024-03-08T10:00:00");
    const expectedDate = new Date("2024-03-11T09:00:00");
    expect(scheduler.nextWorkingTime(date)).toEqual(expectedDate);
  });

  it.only("nextWorkingDay should return the next working day", () => {
    const date = new Date("2024-03-08");
    const expectedDate = new Date("2024-03-11");
    expect(scheduler.nextWorkingDay(date)).toEqual(expectedDate);
  });

  it.only("isWorkingDay should return true for a working day", () => {
    const date = new Date("2024-03-11");
    expect(scheduler.isWorkingDay(date)).toBe(true);
  });

  it.only("isWorkingDay should return false for a holiday", () => {
    const date = new Date("2024-03-08");
    expect(scheduler.isWorkingDay(date)).toBe(false);
  });

  it.only("isWorkingTime should return true for a working time", () => {
    const date = new Date("2024-03-11T10:00:00");
    expect(scheduler.isWorkingTime(date)).toBe(true);
  });

  it.only("isWorkingTime should return false for a non-working time", () => {
    const date = new Date("2024-03-11T20:00:00");
    expect(scheduler.isWorkingTime(date)).toBe(false);
  });

  it.only("isHoliday should return true for a holiday", () => {
    const date = new Date("2024-03-08");
    expect(scheduler.isHoliday(date)).toBe(true);
  });

  it.only("isHoliday should return false for a non-holiday", () => {
    const date = new Date("2024-03-11");
    expect(scheduler.isHoliday(date)).toBe(false);
  });

  it("addTime should add time to a working time", () => {
    const date = new Date("2024-03-11T10:00:00");
    const expectedDate = new Date("2024-03-11T11:00:00");
    expect(scheduler.addTime(date, 3600)).toEqual(expectedDate);
  });

  it("addTime should add time to the next working time if outside working hours", () => {
    const date = new Date("2024-03-11T19:30:00");
    const expectedDate = new Date("2024-03-12T09:10:00");
    expect(scheduler.addTime(date, 600)).toEqual(expectedDate);
  });

  it("subtractTime should subtract time from a working time", () => {
    const date = new Date("2024-03-11T14:00:00");
    const expectedDate = new Date("2024-03-11T13:00:00");
    expect(scheduler.subtractTime(date, 3600)).toEqual(expectedDate);
  });

  it("subtractTime should subtract time from the previous working time if outside working hours", () => {
    const date = new Date("2024-03-11T07:30:00");
    const expectedDate = new Date("2024-03-10T17:50:00");
    expect(scheduler.subtractTime(date, 600)).toEqual(expectedDate);
  });

  it("diff should calculate the difference between two dates considering only working time", () => {
    const startDate = new Date("2024-03-11T09:00:00");
    const endDate = new Date("2024-03-12T12:00:00");
    const expectedDiff = 21600; // 6 hours in seconds
    expect(scheduler.diff(startDate, endDate)).toBe(expectedDiff);
  });
});
