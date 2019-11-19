import React from "react";
import { render } from "@testing-library/react";

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
});
