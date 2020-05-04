import React from "react";
import { render } from "@testing-library/react";
import Bin from "../../components/bin";
import { BinType } from "@tdee/bin-day-fetcher/src/getBinDays";

describe("Bin component", () => {
  it("renders correctly", () => {
    const { getByRole } = render(<Bin bin={BinType.FOOD} />);
    expect(getByRole("img")).toBeVisible();
  });

  it("sends through baseColour as expected", () => {
    const { getByRole } = render(<Bin bin={BinType.FOOD} />);
    expect(getByRole("img")).toContainHTML('fill="#9D5B28"');
  });

  it("varies lidColour appropriately", () => {
    const { getByRole } = render(<Bin bin={BinType.PLASTIC} />);
    expect(getByRole("img")).toContainHTML('fill="#71B43D"');
    expect(getByRole("img")).toContainHTML('fill="#0086C1"');
  });
});
