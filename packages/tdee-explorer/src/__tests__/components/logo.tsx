import React from "react";
import { render } from "@testing-library/react";
import Logo from "../../components/logo";

describe("Logo component", () => {
  it("always contains text BreakfastDinnerTea", () => {
    const { getByText } = render(<Logo />);
    expect(getByText("BreakfastDinnerTea")).toBeVisible();
  });
});
