import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomInput from "./CustomInput";

describe("<CustomInput />", () => {
  it("renders the label text", () => {
    const { getByText } = render(<CustomInput label="Username" />);
    expect(getByText("Username")).toBeTruthy();
  });

  it("renders the TextInput with provided props", () => {
    const { getByPlaceholderText } = render(
      <CustomInput
        textInputProps={{
          placeholder: "Enter username",
        }}
      />
    );
    expect(getByPlaceholderText("Enter username")).toBeTruthy();
  });

  it("renders the error text", () => {
    const { getByText } = render(<CustomInput error="Required field" />);
    expect(getByText("Required field")).toBeTruthy();
  });

  it("calls onChangeText when input changes", () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <CustomInput
        textInputProps={{
          placeholder: "Type here",
          onChangeText: onChangeTextMock,
        }}
      />
    );
    const input = getByPlaceholderText("Type here");
    fireEvent.changeText(input, "hello");
    expect(onChangeTextMock).toHaveBeenCalledWith("hello");
  });
});
