/**
 * Get the start and end time boundaries for a given date based on the provided start and end time strings.
 * @param start - The start time string in the format "HH:mm".
 * @param end - The end time string in the format "HH:mm".
 * @param date - The date for which the boundaries are calculated.
 * @returns An array containing the start and end time boundaries as Date objects.
 */
export function getBoundaries(start: string, end: string, date: Date) {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startTime = new Date(date);
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, endMinute, 0, 0);

  return [startTime, endTime];
}

/**
 * Add a specified number of seconds to a given date.
 * @param date - The date to which the seconds are added.
 * @param seconds - The number of seconds to add.
 * @returns A new Date object with the added seconds.
 */
export function addSeconds(date: Date, seconds: number): Date {
  return new Date(date.getTime() + seconds * 1000);
}

/**
 * Get the timezone offset in seconds for a given timezone string.
 * This works using a simple heuristic: the timezone offset is the difference
 * between the UTC time and the local time for a given date.
 *
 * @param timeZone Timezone string provided by the user
 * @returns timezone offset in seconds
 */
export function getOffset(timeZone: string) {
  const date = new Date();
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
  return (tzDate.getTime() - utcDate.getTime()) / 6e4;
}
