import React from "react";
import { render, screen } from "@testing-library/react";
import Sidebar from "./sidebar";

test("We can render the sidebar component", () => {
  render(
    <Sidebar>
      <div>Hello</div>
      <div>Sausage</div>
    </Sidebar>
  );
  const text = screen.getByText("Hello");
  expect(text).toBeInTheDocument();
  const text2 = screen.getByText("Sausage");
  expect(text2).toBeInTheDocument();
});

test("Set width on first element appropriately", () => {
  render(
    <Sidebar side="left" sideWidth="100px">
      <div>Hello</div>
      <div>Sausage</div>
    </Sidebar>
  );

  const text = screen.getByText("Hello");

  expect(text.parentElement?.style.maxWidth).toEqual("100px");
});

test("Set width on second element when aligned right", () => {
  render(
    <Sidebar side="right" sideWidth="100px">
      <div>Hello</div>
      <div>Sausage</div>
    </Sidebar>
  );

  const text = screen.getByText("Sausage");

  expect(text.parentElement?.style.maxWidth).toEqual("100px");
});
