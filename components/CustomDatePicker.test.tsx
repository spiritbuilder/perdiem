import { fireEvent, render } from "@testing-library/react-native";
import moment from "moment-timezone";
import React from "react";
import CustomDatePicker, { PickerData } from "./CustomDatePicker";


const timeZone = "America/New_York";



describe("<CustomDatePicker /> deterministic", () => {
  const mockOnSelect = jest.fn();
  const mockHandleClose = jest.fn();
  const defaultValue: PickerData = { date: undefined, time: [] };

  const setup = (props = {}) =>
    render(
      <CustomDatePicker
        timeZone={timeZone}
        handleClose={mockHandleClose}
        onSelect={mockOnSelect}
        value={defaultValue}
        visible
        maxDays={3} // keep small for test clarity
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the modal with fixed list of dates", () => {
    const { getByText } = setup();

    console.log(moment().clone().add(1, "day").format("LL"));
    expect(getByText(moment().format("LL"))).toBeTruthy();
    expect(getByText(moment().clone().add(1, "day").format("LL"))).toBeTruthy();
  });

  it("switches to fixed time selection when a date is pressed", () => {
    const { getByText } = setup();
    fireEvent.press(getByText(moment().format("LL")));
    expect(getByText("00:00 - 00:15")).toBeTruthy();
    expect(getByText("00:15 - 00:30")).toBeTruthy();
  });

  it("calls onSelect with fixed time and closes modal", () => {
    const dateValue: PickerData = { date: moment().clone(), time: [] };
    const { getByText } = setup({ value: dateValue });
    fireEvent.press(getByText(moment().format("LL"))); // switch to time view
    fireEvent.press(getByText("00:00 - 00:15"));
    expect(mockOnSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        date: expect.any(moment),
        time: ["00:00", "00:15"],
      })
    );
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it("closes when the close button is pressed", () => {
    const { getByText } = setup();
    fireEvent.press(getByText("Close"));
    expect(mockHandleClose).toHaveBeenCalled();
  });
});
