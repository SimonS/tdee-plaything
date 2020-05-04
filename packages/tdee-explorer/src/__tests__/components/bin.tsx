import React from "react";
import renderer from "react-test-renderer";
import Bin from "../../components/bin";
import { BinType } from "@tdee/bin-day-fetcher/src/getBinDays";

describe("Bin", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<Bin bin={BinType.FOOD} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
