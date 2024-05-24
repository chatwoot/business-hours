/**
 * Get the start and end time boundaries for a given date based on the provided start and end time strings.
 * @param start - The start time string in the format "HH:mm".
 * @param end - The end time string in the format "HH:mm".
 * @param date - The date for which the boundaries are calculated.
 * @returns An array containing the start and end time boundaries as Date objects.
 */
function getBoundaries(start: string, end: string, date: Date) {
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
function addSeconds(date: Date, seconds: number): Date {
  return new Date(date.getTime() + seconds * 1000);
}

/**
 * Represents a scheduler that manages working hours and holidays.
 */
export class Scheduler {
  private hours: {
    [day: number]: Array<{ start: string; end: string }> | null;
  };
  private holidays: Date[];

  /**
   * Creates a new instance of the Scheduler.
   * @param config - The configuration object containing working hours and holidays.
   */
  constructor(config: {
    hours: { [day: number]: Array<{ start: string; end: string }> | null };
    holidays: Date[];
  }) {
    this.hours = config.hours;
    this.holidays = config.holidays;
  }

  /**
   * Checks if a given date is a working day.
   * @param date - The date to check.
   * @returns True if the date is a working day, false otherwise.
   */
  public isWorkingDay(date: Date): boolean {
    if (this.isHoliday(date)) {
      return false;
    }
    const workingHours = this.getWorkingHours(date);
    return workingHours !== null && workingHours.length > 0;
  }

  /**
   * Checks if a given date and time is within working hours.
   * @param date - The date and time to check.
   * @returns True if the date and time is within working hours, false otherwise.
   */
  public isWorkingTime(date: Date): boolean {
    if (!this.isWorkingDay(date)) {
      return false;
    }

    const workingHours = this.getWorkingHours(date);
    if (workingHours) {
      for (const { start, end } of workingHours) {
        const [startTime, endTime] = getBoundaries(start, end, date);

        if (date >= startTime && date <= endTime) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks if a given date is a holiday.
   * @param date - The date to check.
   * @returns True if the date is a holiday, false otherwise.
   */
  public isHoliday(date: Date): boolean {
    const dateOnly = date.toDateString();
    return this.holidays.some((holiday) => holiday.toDateString() === dateOnly);
  }

  public nextWorkingTime(date: Date): Date {
    let nextTime = new Date(date);
    if (!this.isWorkingTime(nextTime)) {
      nextTime = this.nextWorkingDay(nextTime);

      const workingHours = this.hours[nextTime.getDay()];
      if (workingHours) {
        const [startHour, startMinute] = workingHours[0].start
          .split(":")
          .map(Number);

        nextTime.setHours(startHour, startMinute, 0, 0);
      }
    }

    // since it is in the same working time
    return nextTime;
  }

  /**
   * Get the next working day after a given date.
   * @param date - The date after which the next working day is calculated.
   * @returns The next working day as a Date object.
   */
  public nextWorkingDay(date: Date): Date {
    let nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    while (!this.isWorkingDay(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
    }

    return nextDay;
  }

  /**
   * Get the remaining working time for a given date.
   * @param date - The date for which the remaining working time is calculated.
   * @returns The remaining working time in seconds.
   */
  public getRemainingWorkingTime(date: Date): number {
    const workingHours = this.getWorkingHours(date);

    if (workingHours) {
      for (const { start, end } of workingHours) {
        const [startTime, endTime] = getBoundaries(start, end, date);

        if (date >= startTime && date < endTime) {
          return Math.floor((endTime.getTime() - date.getTime()) / 1000);
        }
      }
    }

    return 0;
  }

  /**
   * Get the elapsed working time for a given date.
   * @param date - The date for which the elapsed working time is calculated.
   * @returns The elapsed working time in seconds.
   */
  public getElapsedWorkingTime(date: Date): number {
    const workingHours = this.getWorkingHours(date);

    if (workingHours) {
      for (const { start, end } of workingHours) {
        const [startTime, endTime] = getBoundaries(start, end, date);

        if (date >= startTime && date < endTime) {
          return Math.floor((date.getTime() - startTime.getTime()) / 1000);
        }
      }
    }

    return 0;
  }

  /**
   * Add a specified number of seconds to a given date.
   * @param date - The date to which the seconds are added.
   * @param seconds - The number of seconds to add.
   * @returns A new Date object with the added seconds.
   */
  public addTime(date: Date, seconds: number): Date {
    let newDate = new Date(date);
    let remainingSeconds = seconds;

    while (remainingSeconds > 0) {
      const currentDayWorkingTime = this.getRemainingWorkingTime(newDate);

      if (remainingSeconds <= currentDayWorkingTime) {
        newDate = addSeconds(newDate, remainingSeconds);
        remainingSeconds = 0;
      } else {
        remainingSeconds -= currentDayWorkingTime;
        newDate = this.nextWorkingTime(newDate);
      }
    }

    return newDate;
  }

  /**
   * Get the working hours for a given date.
   * @param date - The date for which the working hours are retrieved.
   * @returns The working hours for the given date.
   */
  private getWorkingHours(date: Date) {
    const dayOfWeek = date.getDay();
    return this.hours[dayOfWeek];
  }
}
