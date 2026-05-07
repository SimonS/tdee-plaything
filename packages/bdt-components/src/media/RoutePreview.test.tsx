import React from "react";
import { render } from "@testing-library/react";
import { RoutePreview } from "./RoutePreview";

// Google example: [[38.5,-120.2],[40.7,-120.95],[43.252,-126.453]]
const EXAMPLE_POLYLINE = "_p~iF~ps|U_ulLnnqC_mqNvxq`@";

describe("RoutePreview", () => {
  it("renders an SVG element", () => {
    const { container } = render(
      <RoutePreview encodedPolyline={EXAMPLE_POLYLINE} />,
    );
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders a polyline element inside the SVG", () => {
    const { container } = render(
      <RoutePreview encodedPolyline={EXAMPLE_POLYLINE} />,
    );
    expect(container.querySelector("polyline")).not.toBeNull();
  });

  it("sets viewBox to '0 0 100 100'", () => {
    const { container } = render(
      <RoutePreview encodedPolyline={EXAMPLE_POLYLINE} />,
    );
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe(
      "0 0 100 100",
    );
  });

  it("preserves aspect ratio via preserveAspectRatio", () => {
    const { container } = render(
      <RoutePreview encodedPolyline={EXAMPLE_POLYLINE} />,
    );
    expect(
      container.querySelector("svg")?.getAttribute("preserveAspectRatio"),
    ).toBe("xMidYMid meet");
  });

  it("uses BDT_RED as the stroke colour", () => {
    const { container } = render(
      <RoutePreview encodedPolyline={EXAMPLE_POLYLINE} />,
    );
    expect(container.querySelector("polyline")?.getAttribute("stroke")).toBe(
      "#b81007",
    );
  });

  it("polyline points attribute is non-empty", () => {
    const { container } = render(
      <RoutePreview encodedPolyline={EXAMPLE_POLYLINE} />,
    );
    const points = container.querySelector("polyline")?.getAttribute("points");
    expect(points).toBeTruthy();
    expect(points?.length).toBeGreaterThan(0);
  });

  it("normalises coordinates to fit within the viewBox with padding", () => {
    // Decoded points: [[38.5,-120.2],[40.7,-120.95],[43.252,-126.453]]
    // Bottom-right corner maps to 95,95; top-left to 5,5 (5px padding on 100px viewBox)
    const { container } = render(
      <RoutePreview encodedPolyline={EXAMPLE_POLYLINE} />,
    );
    const points = container.querySelector("polyline")?.getAttribute("points");
    expect(points).toBe("95.00,95.00 84.21,53.33 5.00,5.00");
  });
});
