import moment from "moment";

export interface Override {
  day: number;
  end_time: string;
  id: string;
  is_open: boolean;
  month: number;
  start_time: string;
}

export interface StoreTime {
  day_of_week?: number;
  end_time?: string;
  id: string;
  is_open?: boolean;
  start_time?: string;
}

const checkIfStoreIsOpen = (
  timezone: string,
  storeTimes: StoreTime[],
  overrides: Override[]
) => {
  let date = moment().tz(timezone);

  let day = date.day() + 1;
  let hours = date.hour();
  let minutes = date.minutes();
  let monthdate = date.date();
  let month = date.month();

//   console.log({ month, monthdate, hours, minutes, day });

  const overRides = overrides.filter(
    (m) => m.month == month && m.day == monthdate
  );

  const times = storeTimes.filter((m) => m.day_of_week === day);

  let resp: boolean = false;

  for (let x of times) {
    if (isInRange(x.start_time, x.end_time, `${hours}:${minutes}`)) {
      resp = x?.is_open || false;
    }
  }

  for (let y of overRides) {
    if (isInRange(y.start_time, y.end_time, `${hours}:${minutes}`)) {
      resp = y.is_open;
    }
  }

  return resp;
};

const convertToHours = (x: string) => {
  return x.split(":").reduce((a, b, i) => {
    let willAdd = i === 0 ? parseInt(b) : parseInt(b) / 60;
    return a + willAdd;
  }, 0);
};
const isInRange = (start: string = "", end: string = "", val: string) => {
  let _start = start == "" ? "00:00" : start;

  let _end = end == "" ? "24:00" : end;

  let right = convertToHours(_end);
  let left = convertToHours(_start);
  let mid = convertToHours(val);

  return left <= mid && mid <= right;
};

const cloneAndAddHrsMinutes = (date: moment.Moment, time: string) => {
  return date
    .clone()
    .startOf("day")
    .add(parseInt(time.split(":")[0]), "hour")
    .add(time.split(":")[1], "minute");
};

const getNextStoreOpenTime = (
  timezone: string = "Europe/Vilnius",
  storeTimes: StoreTime[] = [],
  override: Override[] = []
) => {
  let date = moment().tz("Europe/Vilnius");

  while (true) {
    let day = date.day() + 1;
    let hours = date.hour();
    let minutes = date.minutes();
    let monthdate = date.date();
    let month = date.month();

    const overRides = override
      .filter(
        (m) => m.month !== undefined && m.month == month && m.day == monthdate
      )
      .map((m) => ({
        ...m,
        start_time: m.start_time ? m.start_time : "00:00",
        end_time: m.end_time ? m.end_time : "24:00",
      }));

    const times = storeTimes
      .filter((m) => m.day_of_week === day)
      .map((m) => ({
        ...m,
        start_time: m.start_time ? m.start_time : "00:00",
        end_time: m.end_time ? m.end_time : "24:00",
      }));

    for (let x of times) {
      if (x.is_open === true) {
        let diff =
          convertToHours(x.start_time) - convertToHours(`${hours}:${minutes}`);

        if (diff >= 1) {
          if (overRides.length) {
            for (let y of overRides) {
              if (y.is_open === true) {
                return cloneAndAddHrsMinutes(date, x.start_time);
              } else if (y.is_open === false) {
                if (!isInRange(y.start_time, y.end_time, x.start_time)) {
                  return cloneAndAddHrsMinutes(date, x.start_time);
                }
              }
            }
          } else {
            return cloneAndAddHrsMinutes(date, x.start_time);
          }
        }
      }
    }

    date.startOf("day").add(1, "day");
  }
};

export { checkIfStoreIsOpen, convertToHours, getNextStoreOpenTime, isInRange };
