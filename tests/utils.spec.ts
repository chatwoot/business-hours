import { expect, test } from "vitest";
import { getBoundaries, addSeconds, getOffset } from "../src/utils";

test("getBoundaries should return the start and end time boundaries for a given date", () => {
  const date = new Date("2024-03-08T10:00:00");

  const start = "09:00";
  const end = "12:00";
  const [startTime, endTime] = getBoundaries(start, end, date);

  expect(startTime.getTime()).toBe(1709868600000);
  expect(endTime.getTime()).toBe(1709879400000);
});

test("addSeconds should add a specified number of seconds to a given date", () => {
  const date = new Date("2024-03-08T10:00:00");
  const seconds = 3600;
  const newDate = addSeconds(date, seconds);

  expect(newDate.getTime()).toBe(date.getTime() + seconds * 1000);
});

test("getOffset should return the timezone offset in seconds for a given timezone string", () => {
  const timeZone = "America/New_York";
  const offset = getOffset(timeZone);

  expect(offset).toBe(-240);
});

test("getOffset should return the timezone offset in seconds for a given timezone string", () => {
  const timeZone = "Europe/London";
  const offset = getOffset(timeZone);

  expect(offset).toBe(60);
});

test("getOffset should return the timezone offset in seconds for a given timezone string", () => {
  const timeZone = "Asia/Tokyo";
  const offset = getOffset(timeZone);

  expect(offset).toBe(540);
});
