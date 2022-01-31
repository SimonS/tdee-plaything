import React from "react";
import { render } from "@testing-library/react";
import WeightGraph from "./weight-graph";
import { Weighin } from "@tdee/types/src/bdt";

describe("Weight Graph", () => {
  const renderThreeDays = (maxWeight = 100) => {
    const weighins: Weighin[] = [
      {
        weighinTime: "2020-01-01T00:00:00.000Z",
        weight: maxWeight,
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

    return render(<WeightGraph weighins={weighins} responsive={false} />);
  };

  it("renders the graph", () => {
    const { container } = renderThreeDays();

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

  it("displays every other day", () => {
    const { container } = renderThreeDays();

    expect(
      Array.from(container.querySelectorAll("text")).filter(
        (e) => e.innerHTML === "Jan 02"
      ).length
    ).toEqual(0);
  });

  it("displays correct maximum weight", () => {
    const { container } = renderThreeDays();

    expect(
      Array.from(container.querySelectorAll("text")).filter(
        (e) => e.innerHTML === "100"
      ).length
    ).toEqual(1);
  });

  it("adds a threshold of 1 for large numbers", () => {
    const { container } = renderThreeDays();

    expect(
      Array.from(container.querySelectorAll("text")).filter(
        (e) => e.innerHTML === "101"
      ).length
    ).toEqual(1);
  });

  it("adds a threshold of 0.5 for smaller numbers", () => {
    const { container } = renderThreeDays(99.6);

    expect(
      Array.from(container.querySelectorAll("text")).filter(
        (e) => e.innerHTML === "100"
      ).length
    ).toEqual(1);
  });
});
