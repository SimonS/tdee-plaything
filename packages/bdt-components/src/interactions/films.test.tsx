import React from "react";
import { render } from "@testing-library/react";
import FilmCalendar from "./films";

it("renders the interaction", () => {
  const { container } = render(
    <FilmCalendar
      aggregated={[{ day: "2022-01-01", value: 2 }]}
      grouped={{}}
      responsive={false}
    />
  );

  expect(container).toHaveTextContent("Jun");
});
