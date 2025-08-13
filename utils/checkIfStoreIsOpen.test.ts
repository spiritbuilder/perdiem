import moment from "moment-timezone";
import {
  checkIfStoreIsOpen,
  convertToHours,
  getNextStoreOpenTime,
  isInRange,
  Override,
} from "./checkIfStoreIsOpen";

const fixedDate = "2025-08-13T12:00:00Z";

const timezone = "America/New_York"; 

jest.mock("moment-timezone", () => {
  const actualMoment = jest.requireActual("moment-timezone");
  const fixedMoment = actualMoment(fixedDate);

  // Create a mock function for moment()
  function mockMoment(...args) {
    // Always return the fixedMoment instance
    return fixedMoment;
  }

  // Copy all actual moment properties onto mockMoment
  Object.assign(mockMoment, actualMoment);

  // Mock tz to return the fixed moment as well
  mockMoment.tz = jest.fn(() => fixedMoment);

  // Mock clone() on fixedMoment to return fixedMoment (or a new moment if you prefer)
  fixedMoment.clone = () => fixedMoment;

  return mockMoment;
});


const _fixedDate = new Date("2025-08-13T12:00:00+03:00");

jest.spyOn(global.Date, "now").mockImplementation(() => _fixedDate.getTime());

describe("deterministic store time utils tests", () => {
  beforeEach(() => {});

  test("convertToHours works correctly", () => {
    expect(convertToHours("00:00")).toBe(0);
    expect(convertToHours("01:30")).toBe(1.5);
  });

  test("isInRange works", () => {
    expect(isInRange("09:00", "17:00", "12:00")).toBe(true);
    expect(isInRange("09:00", "17:00", "08:59")).toBe(false);
  });

  test("checkIfStoreIsOpen returns true when store is open", () => {
    const storeTimes = [
      {
        day_of_week: 4,
        start_time: "00:00",
        end_time: "23:59",
        id: "1",
        is_open: true,
      },
    ];

    const overrides: Override[] = [];

    console.log(moment().tz(timezone).day() + 1);

    expect(checkIfStoreIsOpen(timezone, storeTimes, overrides)).toBe(true);
  });

  test("checkIfStoreIsOpen returns false when override closes store", () => {
    const overrides = [
      {
        id: "o1",
        day: 13,
        month: 7,
        start_time: "00:00",
        end_time: "23:59",
        is_open: false,
      },
    ];

    const storeTimes = [
      {
        day_of_week: 4,
        start_time: "00:00",
        end_time: "23:59",
        id: "1",
        is_open: true,
      },
    ];

    expect(checkIfStoreIsOpen(timezone, storeTimes, overrides)).toBe(false);
  });

  test("getNextStoreOpenTime returns correct moment after fixed time", () => {
    const storeTimes = [
      {
        day_of_week: 4,
        start_time: "15:00",
        end_time: "18:00",
        id: "1",
        is_open: true,
      },
    ];

    const overrides: any[] = [];

    const nextOpen = getNextStoreOpenTime(timezone, storeTimes, overrides);

    expect(nextOpen.isAfter(moment(fixedDate))).toBe(true);
    expect(nextOpen.format("HH:mm")).toBe("15:00");
  });
});
