import React from "react";
import { render, fireEvent } from "@testing-library/react";

import TDEEGraph from "./tdee-graph";

describe("<TDEEGraph />", () => {
  test("should render with the correct width and height", async () => {
    const { getByTestId } = render(
      <TDEEGraph checkIns={[]} width={10} height={10} />
    );
    expect(getByTestId("wrapper-svg").getAttribute("viewBox")).toEqual(
      "0 0 10 10"
    );
  });

  test("generic regression test - no data", async () => {
    const graph = render(<TDEEGraph checkIns={[]} width={10} height={10} />);
    expect(graph).toMatchSnapshot();
  });

  test("generic regression test - with data", async () => {
    const graph = render(
      <TDEEGraph
        checkIns={[
          {
            date: new Date(0),
            weight: 10,
          },
          {
            date: new Date(10),
            weight: 8,
          },
        ]}
        width={10}
        height={10}
      />
    );
    expect(graph).toMatchSnapshot();
  });

  test("changing average over modifies the rolling weight value", async () => {
    const { getByTestId, findByText } = render(
      <TDEEGraph
        checkIns={[
          {
            date: new Date(0),
            weight: 10,
          },
          {
            date: new Date(10),
            weight: 8,
          },
        ]}
        width={10}
        height={10}
      />
    );

    fireEvent.change(getByTestId("averageSlider"), { target: { value: 4 } });

    const items = await findByText(/^Avg over/);

    expect(items).toHaveTextContent("4 days");
  });
});
