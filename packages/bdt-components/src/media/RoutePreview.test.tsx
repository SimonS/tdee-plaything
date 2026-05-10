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

  it("passes the correct encoded polyline data through to the SVG points", () => {
    // Decoded points: [[38.5,-120.2],[40.7,-120.95],[43.252,-126.453]]
    // RDP keeps all 3 (non-collinear). Chaikin(3 iters): 3 → 6 → 12 → 24 points.
    // Endpoints are preserved by Chaikin, so first point is still southernmost (y≈95)
    // and last point (index 23) is still northernmost (y≈5).
    const { container } = render(
      <RoutePreview encodedPolyline={EXAMPLE_POLYLINE} />,
    );
    const raw = container.querySelector("polyline")?.getAttribute("points");
    const coords = raw!.split(" ").map((p) => p.split(",").map(Number));
    expect(coords).toHaveLength(24);
    expect(coords[0][1]).toBeCloseTo(95, 0);
    expect(coords[23][1]).toBeCloseTo(5, 0);
  });

  it("simplifies collinear intermediate points before rendering", () => {
    // Encodes [[0,0],[0,0.5],[0,1]] — three points all at lat=0, i.e. collinear
    // RDP (epsilon=0.0001°) removes [0,0.5] because its perpendicular distance
    // from the line [0,0]→[0,1] is 0. The rendered polyline should have 2 pairs.
    const collinearPolyline = "???_t`B?_t`B";
    const { container } = render(
      <RoutePreview encodedPolyline={collinearPolyline} />,
    );
    const raw = container.querySelector("polyline")?.getAttribute("points");
    const coords = raw!.split(" ").map((p) => p.split(",").map(Number));
    expect(coords).toHaveLength(2);
  });
});
