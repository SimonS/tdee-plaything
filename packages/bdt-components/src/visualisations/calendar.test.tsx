import React from "react";
import { render, fireEvent } from "@testing-library/react";
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

it("fires onclick event", () => {
  const mockFn = jest.fn();
  const { container } = render(
    <Calendar
      data={[]}
      from={new Date("2020-01-01")}
      to={new Date("2022-01-01")}
      responsive={false}
      onClick={mockFn}
    />
  );

  const firstDate = container.querySelector("g rect");

  if (firstDate) fireEvent.click(firstDate);
  expect(mockFn).toHaveBeenCalled();
});

const data = [
  [1, 145],
  [2, 280],
  [3, 415],
];
it.each(data)(
  "when there are %i years in the calendar, height is %ipx",
  (years, height) => {
    const { getByTestId } = render(
      <Calendar
        data={[]}
        from={new Date("2020-01-01")}
        to={new Date(`${2019 + years}-12-31`)}
        responsive={false}
      />
    );

    expect(getByTestId("calendar-root")).toHaveStyle({
      height: `${height}px`,
      width: "100%",
    });
  }
);
