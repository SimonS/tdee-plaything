import React from "react";
import { render } from "@testing-library/react";
import PodcastCalendar from "./podcasts";

it("renders the interaction", () => {
  const { container } = render(
    <PodcastCalendar
      aggregated={[{ day: "2022-06-04", value: 2 }]}
      grouped={{}}
      responsive={false}
    />
  );

  expect(container).toHaveTextContent("Jun");
});
