import React from "react";
import { render } from "@testing-library/react";
import Calendar from "./calendar";

it("renders the calendar", () => {
  const { container } = render(
    <Calendar
      data={[]}
      from={new Date("2020-01-01")}
      to={new Date("2022-01-01")}
      responsive={false}
    />
  );

  expect(container).toHaveTextContent("Jun");
});
