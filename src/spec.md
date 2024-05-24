## Business Hours

We export a class called Scheduler

```js
import { Scheduler } from '@scmmishra/business-hours'

const scheduler = new Scheduler({
  hours: {
    0: null
    1: [{start, end}, {start, end}]
    2: [{start, end}, {start, end}]
    3: [{start, end}]
    4: [{start, end}]
    5: [{start, end}]
    6: null
  }
  holidays: ['2024-03-08', '2024-03-09','2024-03-10']
})
```

Then the Scheduler object will have the following methods

### `nextWorkingTime`

This method takes a date and returns the next working time. If the date is a holiday, it will return the next working day. If the date is a working day, it will return the next working time.

```js
scheduler.nextWorkingTime(new Date("2024-03-08"));
```

### `nextWorkingDay`

This method takes a date and returns the next working day. If the date is a holiday, it will return the next working day. If the date is a working day, it will return the same day.

```js
scheduler.nextWorkingDay(new Date("2024-03-08"));
```

### `isWorkingDay`

This method takes a date and returns a boolean. If the date is a holiday, it will return false. If the date is a working day, it will return true.

```js
scheduler.isWorkingDay(new Date("2024-03-08"));
```

### `isWorkingTime`

This method takes a date and returns a boolean. If the date is a holiday, it will return false. If the date is a working day, it will return true.

```js
scheduler.isWorkingTime(new Date("2024-03-08"));
```

### `isHoliday`

This method takes a date and returns a boolean. If the date is a holiday, it will return true. If the date is a working day, it will return false.

```js
scheduler.isHoliday(new Date("2024-03-08"));
```

### `addTime`

This method takes a datetime, along with the time to add in seconds and returns the new date. If the date is outside working hours, it will add it to the working hours, suppose the working hours is between 8AM to 5PM, and I pass it 7:30 PM and ask it to add 10 mins, it will return 8:10 PM.

```js
scheduler.addTime(new Date("2024-03-08"), 3600);
```

### `subtractTime` [PENDING]

This method takes a datetime, along with the time to subtract in seconds and returns the new date. If the date is outside working hours, it will subtract it from the working hours, suppose the working hours is between 8AM to 5PM, and I pass it 7:30 PM and ask it to subtract 10 mins, it will return 4:50 PM. Basically it traversed back to the previous working hour/day and subtracted the time from the working hours.

```js
scheduler.addTime(new Date("2024-03-08"), 3600);
```

### `diff` [PENDING]

This method calculates the difference between two moments, counting only working time between them

```js
scheduler.diff(new Date("2024-03-08"), new Date("2024-03-08"));
```
