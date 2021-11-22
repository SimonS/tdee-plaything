import React from "react";
import { render, screen } from "@testing-library/react";
import Stack from "./stack";

test("We can render the stack component", () => {
  render(
    <Stack>
      <div>Hello</div>
    </Stack>
  );
  const text = screen.getByText("Hello");
  expect(text).toBeInTheDocument();
});

test("We can override the tagname", () => {
  const { container } = render(
    <Stack as="header">
      <div>Hello</div>
    </Stack>
  );

  expect(container.querySelectorAll("header")).toHaveLength(1);
});
