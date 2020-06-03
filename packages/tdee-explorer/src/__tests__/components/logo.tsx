import React from "react";
import { render } from "@testing-library/react";
import Logo from "../../components/logo";
import { highlighted } from "../../components/logo.module.css";

describe("Logo component", () => {
  it("highlights the correct word when appropriate", () => {
    const { getByText } = render(<Logo highlight="Breakfast" />);
    expect(getByText("Breakfast")).toHaveClass(highlighted);
  });

  it("doesn't highlight other words", () => {
    const { getByText } = render(<Logo highlight="Dinner" />);
    expect(getByText("Breakfast")).not.toHaveClass(highlighted);
    expect(getByText("Tea")).not.toHaveClass(highlighted);
  });
});
