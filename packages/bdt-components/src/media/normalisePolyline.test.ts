import { normalisePolyline } from "./normalisePolyline";
import { LatLng } from "./decodePolyline";

describe("normalisePolyline", () => {
  it("returns empty string for empty input", () => {
    expect(normalisePolyline([])).toBe("");
  });

  it("centres a single point at (50.00,50.00)", () => {
    expect(normalisePolyline([[51.5, -0.1]])).toBe("50.00,50.00");
  });

  it("centres a vertical route (constant longitude) horizontally", () => {
    // Two points at the same lng → all x coords should be at the centre (50)
    const points: LatLng[] = [
      [0, 0],
      [1, 0],
    ];
    expect(normalisePolyline(points)).toBe("50.00,95.00 50.00,5.00");
  });

  it("centres a horizontal route (constant latitude) vertically", () => {
    // midLat = 0, cos(0) = 1 → no lng correction needed
    // lngRange = 2 > latRange = 1 → lat axis is centred
    const points: LatLng[] = [
      [-0.5, 0],
      [0.5, 2],
    ];
    expect(normalisePolyline(points)).toBe("5.00,72.50 95.00,27.50");
  });

  it("applies cosine correction: at 60°N midlat, 2° longitude equals 1° latitude", () => {
    // cos(60°) = 0.5 exactly, so 2° lng × 0.5 = 1° lat equivalent
    // latRange = 2°, lngRangeCorrected = 2° × 0.5 = 1° → lat dominates
    // scale = 90/2 = 45; lngExtent = 45 → xOffset = 22.5 (centred)
    const points: LatLng[] = [
      [59, 0],
      [61, 2],
    ];
    expect(normalisePolyline(points)).toBe("27.50,95.00 72.50,5.00");
  });
});
