function getBoundaries(start: string, end: string, date: Date) {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const startTime = new Date(date);
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, endMinute, 0, 0);

  return [startTime, endTime];
}

function addSeconds(date: Date, seconds: number): Date {
  return new Date(date.getTime() + seconds * 1000);
}

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
    const workingHours = this.getWorkingHours(date);
    return workingHours !== null && workingHours.length > 0;
  }

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

  private getWorkingHours(date: Date) {
    const dayOfWeek = date.getDay();
    return this.hours[dayOfWeek];
  }
}
