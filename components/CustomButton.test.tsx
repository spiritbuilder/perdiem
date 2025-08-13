import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import CustomButton from "./CustomButton";

describe("<CustomButton />", () => {
  it("renders the text when not loading", () => {
    const { getByText } = render(<CustomButton text="Click Me" />);
    expect(getByText("Click Me")).toBeTruthy();
  });

  it("shows loading indicator when loading prop is true", () => {
    const { getByRole, queryByText, getByAccessibilityHint } = render(
      <CustomButton loading text="Click Me" />
    );
    const indicator = getByAccessibilityHint("loading");
    expect(indicator).toBeTruthy();
    expect(queryByText("Click Me")).toBeNull();
  });

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn();
    const { getByRole, getByText } = render(
      <CustomButton text="Press Me" onPress={onPressMock} />
    );
    fireEvent.press(getByText("Press Me"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("applies inactive style when disabled", () => {
    const { getByAccessibilityHint } = render(
      <CustomButton text="Disabled" disabled />
    );
    const touchable = getByAccessibilityHint("touchable");

    expect(touchable.props.style.backgroundColor).toBe("grey");
  });
});
