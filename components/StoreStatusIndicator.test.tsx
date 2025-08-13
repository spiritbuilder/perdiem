import { render } from "@testing-library/react-native";
import React from "react";
import StoreStatus from "./StoreStatusIndicator";

describe("<StoreStatus />", () => {
  it("renders loading state before first load", () => {
    const { getByText, getAllByAccessibilityHint } = render(
      <StoreStatus loading firstLoaded={false} />
    );
    expect(getAllByAccessibilityHint("loading")).toBeTruthy(); // ActivityIndicator
    expect(getByText("Checking if store is open")).toBeTruthy();
  });

  it("renders store open state", () => {
    const { getByText, getByTestId } = render(
      <StoreStatus status loading={false} firstLoaded />
    );
    expect(getByText("🛒 Store Open")).toBeTruthy();
    const orb = getByTestId("orb");
    expect(orb.props.style.backgroundColor).toBe("#41dc83");
  });

  it("renders store closed state", () => {
    const { getByText, getByTestId } = render(
      <StoreStatus status={false} loading={false} firstLoaded />
    );
    expect(getByText("🔒 Store Closed")).toBeTruthy();
    const orb = getByTestId("orb");
    expect(orb.props.style.backgroundColor).toBe("#FF2C2C");
  });
});
