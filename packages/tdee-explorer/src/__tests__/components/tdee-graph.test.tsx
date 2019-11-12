import React from "react";
import { render } from "@testing-library/react";

import TDEEGraph from "../../components/tdee-graph";

describe("<TDEEGraph />", () => {
  test("should display the graph", async () => {
    const { getByText } = render(
      <TDEEGraph checkIns={[]} width={10} height={10} />
    );

    expect(getByText("Computed Calories")).toBeInTheDocument();
  });
});
