import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WeightGraph from "./weight-graph";
import { Weighin, CalculatedWeighin } from "@tdee/types/src/bdt";

const getYVals = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("line + text"))
    .map((val) => parseInt(val.textContent || ""))
    .filter((val) => !isNaN(val));

const getPaths = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("path"));

const getDots = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("circle"));

const generateWeighins = (n: number) => {
  let weighins: Weighin[] = [];
  for (let i = 0; i < n; i++) {
    weighins.push({
      weighinTime: `2020-01-${(i + 1)
        .toString()
        .padStart(2, "0")}T00:00:00.000Z`,
      weight: i + 1,
      bodyFatPercentage: 25,
    });
  }
  return weighins;
};

describe("basic weight graph rendering", () => {
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

  it("adds an appropriate threshold to the y axis", () => {
    const { container } = renderThreeDays();

    const yNums = getYVals(container);

    expect(yNums[yNums.length - 1]).toEqual(101);
    expect(yNums[0]).toEqual(89);
  });

  it("renders correct number of weighin dots", () => {
    const { container } = renderThreeDays();

    const dots = getDots(container);

    expect(dots).toHaveLength(3);
  });

  it("filters between dates", () => {
    const weighins = generateWeighins(3);

    const { container } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-02T00:00:00.000Z",
        }}
      />
    );

    expect(getDots(container)).toHaveLength(2);
  });

  it("displays x dates at a time", () => {
    const weighins: Weighin[] = generateWeighins(12);

    const { container } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-02T00:00:00.000Z",
          displayDatesAtATime: 3,
        }}
      />
    );

    const dots = getDots(container);

    expect(dots).toHaveLength(3);
  });

  test("doesn't display a legend by default", () => {
    const weighins: Weighin[] = generateWeighins(12);

    const { container } = render(
      <WeightGraph weighins={weighins} responsive={false} />
    );

    expect(
      Array.from(container.querySelectorAll("text")).filter(
        (e) => e.innerHTML === "Weight"
      ).length
    ).toBe(0);
  });

  test("handles empty datasets gracefully", () => {
    const weighins: Weighin[] = [];

    const { getByText } = render(
      <WeightGraph weighins={weighins} responsive={false} />
    );

    expect(getByText("No data to display")).toBeTruthy();
  });
});

describe("trend lines", () => {
  it("renders a trend line with extra dots", () => {
    const weighins: CalculatedWeighin[] = [
      {
        weighinTime: "2020-01-01T00:00:00.000Z",
        weight: 100,
        bodyFatPercentage: 25,
        weightTrend: 100,
      },
      {
        weighinTime: "2020-01-02T00:00:00.000Z",
        weight: 95,
        bodyFatPercentage: 25,
        weightTrend: 90,
      },
      {
        weighinTime: "2020-01-03T00:00:00.000Z",
        weight: 90,
        bodyFatPercentage: 24,
        weightTrend: 90,
      },
    ];

    const { container } = render(
      <WeightGraph weighins={weighins} responsive={false} />
    );

    const dots = getDots(container);

    expect(dots).toHaveLength(6);
  });

  it("adjust thresholds for trend line", () => {
    const weighins: CalculatedWeighin[] = [
      {
        weighinTime: "2020-01-01T00:00:00.000Z",
        weight: 100,
        bodyFatPercentage: 25,
        weightTrend: 110,
      },
      {
        weighinTime: "2020-01-02T00:00:00.000Z",
        weight: 95,
        bodyFatPercentage: 25,
        weightTrend: 90,
      },
      {
        weighinTime: "2020-01-03T00:00:00.000Z",
        weight: 90,
        bodyFatPercentage: 24,
        weightTrend: 80,
      },
    ];

    const { container } = render(
      <WeightGraph weighins={weighins} responsive={false} />
    );

    const yNums = getYVals(container);

    expect(yNums[yNums.length - 1]).toEqual(110);
    expect(yNums[0]).toEqual(80);
  });

  test("trend line is dashed", () => {
    const weighins: CalculatedWeighin[] = [
      {
        weighinTime: "2020-01-01T00:00:00.000Z",
        weight: 100,
        bodyFatPercentage: 25,
        weightTrend: 110,
      },
      {
        weighinTime: "2020-01-02T00:00:00.000Z",
        weight: 95,
        bodyFatPercentage: 25,
        weightTrend: 90,
      },
      {
        weighinTime: "2020-01-03T00:00:00.000Z",
        weight: 90,
        bodyFatPercentage: 24,
        weightTrend: 80,
      },
    ];

    const { container } = render(
      <WeightGraph weighins={weighins} responsive={false} />
    );

    const paths = getPaths(container);

    expect(paths.filter((path) => path.style.strokeDasharray)).toHaveLength(1);
  });

  test("adds a legend when weight trend present", () => {
    const weighins: CalculatedWeighin[] = [
      {
        weighinTime: "2020-01-01T00:00:00.000Z",
        weight: 100,
        bodyFatPercentage: 25,
        weightTrend: 110,
      },
      {
        weighinTime: "2020-01-02T00:00:00.000Z",
        weight: 95,
        bodyFatPercentage: 25,
        weightTrend: 90,
      },
      {
        weighinTime: "2020-01-03T00:00:00.000Z",
        weight: 90,
        bodyFatPercentage: 24,
        weightTrend: 80,
      },
    ];

    const { container } = render(
      <WeightGraph weighins={weighins} responsive={false} />
    );

    expect(
      Array.from(container.querySelectorAll("text")).filter(
        (e) => e.innerHTML === "Weight Trend"
      ).length
    ).toBeGreaterThan(0);
  });
});

describe("weight navigation", () => {
  it("displays a nav when needed", () => {
    const weighins = generateWeighins(12);

    const { getByRole } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-02T00:00:00.000Z",
          displayDatesAtATime: 3,
        }}
      />
    );

    expect(getByRole("navigation")).toBeVisible();
  });
  it("next button displays appropriately", () => {
    const weighins = generateWeighins(12);

    const { getByText } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-01T00:00:00.000Z",
          displayDatesAtATime: 3,
        }}
      />
    );

    expect(getByText(">")).toBeVisible();
  });

  it("previous button displays appropriately", () => {
    // important to have an unsorted array go in so as not to falsely rely on nivo's implicit sort.
    const weighins = generateWeighins(12).reverse();

    const { getByText } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-08T00:00:00.000Z",
          displayDatesAtATime: 3,
        }}
      />
    );

    expect(getByText("<")).toBeVisible();
  });

  it("clicking previous shows earlier dates", () => {
    const weighins = generateWeighins(12);

    const { getByText, container } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-02T00:00:00.000Z",
          displayDatesAtATime: 3,
        }}
      />
    );

    userEvent.click(getByText("<"));
    expect(
      Array.from(container.querySelectorAll("text")).filter(
        (e) => e.innerHTML === "Jan 01"
      )
    ).toHaveLength(1);
  });

  it("clicking next shows later dates", () => {
    const weighins = generateWeighins(12);

    const { getByText, container } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-11T00:00:00.000Z",
          displayDatesAtATime: 1,
        }}
      />
    );

    userEvent.click(getByText(">"));

    expect(
      Array.from(container.querySelectorAll("text")).filter(
        (e) => e.innerHTML === "12"
      )
    ).toHaveLength(1);
  });
});
