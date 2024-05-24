import { expect, test } from "vitest";
import { Scheduler } from "../src/index";

const scheduler = new Scheduler({
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

test("nextWorkingTime should return the next working time", () => {
  const date = new Date("2024-03-08T10:00:00");
  const expectedDate = new Date("2024-03-11T09:00:00");
  expect(scheduler.nextWorkingTime(date)).toEqual(expectedDate);
});

test("nextWorkingDay should return the next working day", () => {
  const date = new Date("2024-03-08");
  const expectedDate = new Date("2024-03-11");
  expect(scheduler.nextWorkingDay(date)).toEqual(expectedDate);
});

test("isWorkingDay should return true for a working day", () => {
  const date = new Date("2024-03-11");
  expect(scheduler.isWorkingDay(date)).toBe(true);
});

test("isWorkingDay should return false for a holiday", () => {
  const date = new Date("2024-03-08");
  expect(scheduler.isWorkingDay(date)).toBe(false);
});

test("isWorkingTime should return true for a working time", () => {
  const date = new Date("2024-03-11T10:00:00");
  expect(scheduler.isWorkingTime(date)).toBe(true);
});

test("isWorkingTime should return false for a non-working time", () => {
  const date = new Date("2024-03-11T20:00:00");
  expect(scheduler.isWorkingTime(date)).toBe(false);
});

test("isHoliday should return true for a holiday", () => {
  const date = new Date("2024-03-08");
  expect(scheduler.isHoliday(date)).toBe(true);
});

test("isHoliday should return false for a non-holiday", () => {
  const date = new Date("2024-03-11");
  expect(scheduler.isHoliday(date)).toBe(false);
});

test("addTime should add time to a working time", () => {
  const date = new Date("2024-03-11T10:00:00");
  const expectedDate = new Date("2024-03-11T11:00:00");
  expect(scheduler.addTime(date, 3600)).toEqual(expectedDate);
});

test("addTime should add time to the next working time if outside working hours", () => {
  const date = new Date("2024-03-11T19:30:00");
  const expectedDate = new Date("2024-03-12T09:10:00");
  expect(scheduler.addTime(date, 600)).toEqual(expectedDate);
});

test("getElapsedWorkingTime should return the elapsed working time within working hours", () => {
  const date = new Date("2024-03-11T10:30:00");
  expect(scheduler.getElapsedWorkingTime(date)).toBe(5400);
});

test("getElapsedWorkingTime should return 0 for a non-working time", () => {
  const date = new Date("2024-03-11T20:00:00");
  expect(scheduler.getElapsedWorkingTime(date)).toBe(0);
});

test("getElapsedWorkingTime should return 0 for a holiday", () => {
  const date = new Date("2024-03-08T10:00:00");
  expect(scheduler.getElapsedWorkingTime(date)).toBe(3600);
});
