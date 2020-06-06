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

  it("highlights breakfast if morning by default", () => {
    jest.spyOn(Date.prototype, "getHours").mockImplementationOnce(() => 9);

    const { getByText } = render(<Logo />);

    expect(getByText("Breakfast")).toHaveClass(highlighted);
  });

  it("highlights dinner at the correct time", () => {
    jest.spyOn(Date.prototype, "getHours").mockImplementationOnce(() => 12);

    const { getByText } = render(<Logo />);

    expect(getByText("Dinner")).toHaveClass(highlighted);
  });

  it("highlights tea at the correct time", () => {
    jest.spyOn(Date.prototype, "getHours").mockImplementationOnce(() => 18);

    const { getByText } = render(<Logo />);

    expect(getByText("Tea")).toHaveClass(highlighted);
  });

  it("links to the homepage", () => {
    const { getByText } = render(<Logo />);
    expect(getByText("Breakfast").closest("a")).toHaveAttribute("href", "/");
  });
});
