import React from "react";
import { render, screen } from "@testing-library/react";
import HelloComponent from "./hello";

test("Header contains correct text", () => {
  render(<HelloComponent name="it works" />);
  const text = screen.getByText("Hello it works");
  expect(text).toBeInTheDocument();
});
