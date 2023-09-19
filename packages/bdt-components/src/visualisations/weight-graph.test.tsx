import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WeightGraph from "./weight-graph";
import { Weighin, CalculatedWeighin } from "@tdee/types/src/bdt";

jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <OriginalModule.ResponsiveContainer width={800} height={800}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

const getPaths = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("path"));

const getDots = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(".recharts-dot"));

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

    expect(
      container.getElementsByClassName("recharts-surface").length
    ).toBeGreaterThan(0);
  });

  it("adds an appropriate threshold to the y axis", () => {
    const { getAllByText } = renderThreeDays();

    expect(
      getAllByText("100.1").length
    ).toBeGreaterThan(0);
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

  test("handles empty datasets gracefully", () => {
    const weighins: Weighin[] = [];

    const { getByText } = render(
      <WeightGraph weighins={weighins} responsive={false} />
    );

    expect(getByText("No data to display")).toBeTruthy();
  });

  test("works with no date in range", () => {
    const weighins: Weighin[] = generateWeighins(10);

    const { getAllByText } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-13T00:00:00.000Z",
          displayDatesAtATime: 3,
        }}
      />
    );

    expect(
      getAllByText("weight").length
    ).toBeGreaterThan(0);
  });

  it("displays the dates rendered in a title", () =>{
    const weighins: Weighin[] = generateWeighins(10);

    const { getByRole } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-01T00:00:00.000Z",
          displayDatesAtATime: 3,
        }}
      />
    );

    expect(getByRole("heading")).toHaveTextContent("2020-01-01 – 2020-01-03")
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

    const { getAllByText } = render(
      <WeightGraph weighins={weighins} responsive={false} />
    );

    expect(
      getAllByText("110.1").length
    ).toBeGreaterThan(0);

    expect(
      getAllByText("79.9").length
    ).toBeGreaterThan(0);
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
    expect(paths.filter((path) => path.getAttribute("stroke-dasharray"))).toHaveLength(1);
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

    const { queryByText } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-01T00:00:00.000Z",
          displayDatesAtATime: 3,
        }}
      />
    );

    expect(queryByText("<")).toBeNull();
    expect(queryByText(">")).toBeVisible();
  });

  it("previous button displays appropriately", () => {
    // important to have an unsorted array go in so as not to falsely rely on nivo's implicit sort.
    const weighins = generateWeighins(12).reverse();

    const { queryByText } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-10T00:00:00.000Z",
          displayDatesAtATime: 3,
        }}
      />
    );

    expect(queryByText("<")).toBeVisible();
    expect(queryByText(">")).toBeNull();
  });

  it("clicking previous shows earlier dates", async () => {
    const weighins = generateWeighins(12);

    const { getByText, findAllByText } = render(
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

    const jans = await findAllByText("01/01")
    expect(
      jans
    ).toHaveLength(1);
  });

  it("clicking next shows later dates", async () => {
    const weighins = generateWeighins(12);

    const { getByText, findAllByText } = render(
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

    const twelves = await findAllByText("12/01")
    expect(twelves).toHaveLength(1);
  });
});
