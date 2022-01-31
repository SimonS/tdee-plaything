import React from "react";
import { render, waitFor } from "@testing-library/react";
import WeightGraph from "./weight-graph";
import { Weighin } from "@tdee/types/src/bdt";

describe("Weight Graph", () => {
  /* things to test:
   * - the graph is rendered
   * - the graph renders the correct days
   * - the graph renders the correct weights on the y-axis
   * - dare I say it, snapshots?
   */
  it("renders the graph", () => {
    const weighins: Weighin[] = [
      {
        weighinTime: "2020-01-01T00:00:00.000Z",
        weight: 100,
        bodyFatPercentage: 25,
      },
      {
        weighinTime: "2020-01-02T00:00:00.000Z",
        weight: 90,
        bodyFatPercentage: 25,
      },
      {
        weighinTime: "2020-01-03T00:00:00.000Z",
        weight: 90,
        bodyFatPercentage: 24,
      },
    ];

    const { container } = render(
      <WeightGraph weighins={weighins} responsive={false} />
    );

    /**
     * getByText doesn't take into consideration SVG <text> elements (I'm guessing
     * because they're not part of the Accessibility Tree), so do it the hard way.
     * This is a bit of a hack, but it works.
     */
    expect(
      Array.from(container.querySelectorAll("text")).filter(
        (e) => e.innerHTML === "Jan 01"
      ).length
    ).toBeGreaterThan(0);
  });
});
