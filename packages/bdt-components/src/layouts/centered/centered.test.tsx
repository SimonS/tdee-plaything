import React from "react";
import { render, screen } from "@testing-library/react";
import Centered from "./centered";

test("We can render the centered component", () => {
  render(
    <Centered>
      <div>Hello</div>
    </Centered>
  );
  const text = screen.getByText("Hello");
  expect(text).toBeInTheDocument();
});
