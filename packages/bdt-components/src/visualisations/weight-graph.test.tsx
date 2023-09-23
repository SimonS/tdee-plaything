import React from "react";
import { fireEvent, render } from "@testing-library/react";
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
  let date = new Date("2020-01-01")
  for (let i = 0; i < n; i++) {
    weighins.push({
      weighinTime: date.toISOString(),
      weight: i + 1,
      bodyFatPercentage: 25,
    });
    date.setDate(date.getDate() + 1);
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

  it("filters using from", () => {
    const weighins = generateWeighins(3);

    const { container } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-02",
        }}
      />
    );

    expect(getDots(container)).toHaveLength(2);
  });

  it("filters using to", () => {
    const weighins = generateWeighins(5);

    const { container } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          to: "2020-01-02",
        }}
      />
    );

    expect(getDots(container)).toHaveLength(2);
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
        }}
      />
    );

    expect(
      getAllByText("weight").length
    ).toBeGreaterThan(0);
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
  it("displays to and from fields", () => {
    const weighins = generateWeighins(10);

    const { getByLabelText } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
      />
    );

    expect(getByLabelText("From")).toBeVisible();
    expect(getByLabelText("To")).toBeVisible();
  });

  it("to and from are populated with the filter values", () => {
    const weighins = generateWeighins(10);

    const { getByLabelText } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-02",
          to: "2020-01-05"
        }}
      />
    );

    expect(getByLabelText("From")).toHaveValue("02/01/2020");
    expect(getByLabelText("To")).toHaveValue("05/01/2020");
  });

  it("date selector focused on current month", () => {
    const weighins = generateWeighins(10);

    const { getByText } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-02",
          to: "2020-01-05"
        }}
      />
    );

    expect(getByText("January 2020")).toBeVisible();
  })

  it("date selector affects the graph", () => {
    const weighins = generateWeighins(10);

    const { getByText, getByLabelText } = render(
      <WeightGraph
        weighins={weighins}
        responsive={false}
        filter={{
          from: "2020-01-02",
          to: "2020-01-05"
        }}
      />
    );

    fireEvent.click(getByText("1"));
    fireEvent.click(getByText("16"));

    expect(getByLabelText("From")).toHaveValue("01/01/2020");
    expect(getByLabelText("To")).toHaveValue("16/01/2020");
  })
})
