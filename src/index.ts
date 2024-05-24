export class Scheduler {
  private hours: {
    [day: number]: Array<{ start: string; end: string }> | null;
  };
  private holidays: Date[];

  constructor(config: {
    hours: { [day: number]: Array<{ start: string; end: string }> | null };
    holidays: Date[];
  }) {
    this.hours = config.hours;
    this.holidays = config.holidays;
  }

  public isWorkingDay(date: Date): boolean {
    if (this.isHoliday(date)) {
      return false;
    }

    const dayOfWeek = date.getDay();
    const workingHours = this.hours[dayOfWeek];

    return workingHours !== null && workingHours.length > 0;
  }

  public isWorkingTime(date: Date): boolean {
    if (!this.isWorkingDay(date)) {
      return false;
    }

    const dayOfWeek = date.getDay();
    const workingHours = this.hours[dayOfWeek];

    if (workingHours) {
      for (const { start, end } of workingHours) {
        const [startHour, startMinute] = start.split(":").map(Number);
        const [endHour, endMinute] = end.split(":").map(Number);

        const startTime = new Date(date);
        startTime.setHours(startHour, startMinute, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(endHour, endMinute, 0, 0);

        if (date >= startTime && date <= endTime) {
          return true;
        }
      }
    }

    return false;
  }

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

  public nextWorkingDay(date: Date): Date {
    let nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    while (!this.isWorkingDay(nextDay)) {
      nextDay.setDate(nextDay.getDate() + 1);
    }

    return nextDay;
  }

  public addTime(date: Date, seconds: number): Date {
    // TODO: Implement addTime logic
    throw new Error("Method not implemented.");
  }

  public subtractTime(date: Date, seconds: number): Date {
    // TODO: Implement subtractTime logic
    throw new Error("Method not implemented.");
  }

  public diff(startDate: Date, endDate: Date): number {
    // TODO: Implement diff logic
    throw new Error("Method not implemented.");
  }
}
