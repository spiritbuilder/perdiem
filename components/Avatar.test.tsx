import { render } from "@testing-library/react-native";
import React from "react";
import Avatar from "./Avatar";

describe("<Avatar />", () => {
  it("renders the name text", () => {
    const { getByText } = render(<Avatar name="John Doe" />);
    expect(getByText("John Doe")).toBeTruthy();
  });

  it("uses placeholder image when no icon prop is provided", () => {
    const { getByRole, getByAccessibilityHint } = render(
      <Avatar name="Jane" />
    );
    const image = getByAccessibilityHint("image");
    expect(image.props.source.testUri).toBe(
      "../../../assets/images/cool-emoji.png"
    );
  });

  it("uses custom icon when icon prop is provided", () => {
    const testUri = "https://example.com/avatar.png";
    const { getByAccessibilityHint } = render(
      <Avatar name="Jane" icon={testUri} />
    );
    const image = getByAccessibilityHint("image");
    expect(image.props.source).toEqual({ uri: testUri });
  });
});
