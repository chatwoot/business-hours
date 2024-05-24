<div align="center">
  <h1>Business Hours</h1>
</div>

## Installation

```sh
pnpm install @scmmishra/business-hours
```

```sh
npm install @scmmishra/business-hours
```

```sh
yarn add @scmmishra/business-hours
```

## Usage

PicoSearch exposes a single function: `picoSearch()`. This function takes an array of objects, a search term, an array of keys to search against, and an optional algorithm argument. It returns an array of objects that match the search term. You can find the [typedoc here](https://paka.dev/npm/@scmmishra/business-hours/api)

```typescript
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
```

## Methods available

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

### `subtractTime` [IMPLEMENTATION PENDING]

This method takes a datetime, along with the time to subtract in seconds and returns the new date. If the date is outside working hours, it will subtract it from the working hours, suppose the working hours is between 8AM to 5PM, and I pass it 7:30 PM and ask it to subtract 10 mins, it will return 4:50 PM. Basically it traversed back to the previous working hour/day and subtracted the time from the working hours.

```js
scheduler.addTime(new Date("2024-03-08"), 3600);
```

### `diff` [IMPLEMENTATION PENDING]

This method calculates the difference between two moments, counting only working time between them

```js
scheduler.diff(new Date("2024-03-08"), new Date("2024-03-08"));
```
